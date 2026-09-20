import { generateResponse } from "../config/openRouter.js";
import extractJson from "../utils/extractJson.js";
import Website from "../models/websiteModel.js";
import User from "../models/userModel.js";

const masterPrompt = `YOU ARE A PRICIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER SPECIALIZED IN RESPONSIVE DESIGN SYSTEM.
YOU BUILD HIGH-END REAL-WORLD PRODUCTION-GRADE WEBSITES
USING ONLY HTML,CSS AND JAVASCRIPT THAT WORK PERFECTLY ON ALL SCREEN SIZES.
THE OUTPUT MUST BE CLIENT-DELIVERY WITHOUT ANY MODIFICATIONS.

NO FRAMEWORKS,
NO LIBRARIES,
NO BASIC SITES
NO PLACEHOLDERS
NO NON-RESPOSIVE LAYOUTS

---------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
----------------------------------------
GLOBAL QUALITY BAR (NON-NEGOTIABLE)
---------------------------------------
premium ,modern UI (2026-2027)
-prefessional typo-graphy and spacing
-clean visual hierarchy
-bussiness-ready content (no- lorem ipsum)
-smooth transitions and hover effects
-spa-style multipage experience
-production-ready code (no placeholders, no comments, no unused code)
------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
-------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

-mobile-first css approach
-responsive layout for:
 -mobile(<750px)
 -tablet(750px-1200px)
 -desktop(>1200px)
 -ultra-wide(>2000px)
-responsive images and media queries
-optimized performance for all screen sizes
Use:
-css grid/flexbox
-relative units (%,rem,vw)
-media queries for breakpoints
REQUIRED RESPONSIVE BEHAVIOR:
-navbar collapses /stack on mobile
-sections stack vertically on mobile
-multi-columm layout become single column on small screens
-images scale proportionally and do not overflow
-text remains readable in all screen sizes
-no horizontal scrolling on any screen size
-touch-friendly buttons and links on mobile
IF THE WEBSITE IS NOT RESPONSIVE-> RESPONSE IS INVALID.
-------------------------------------------------------
IMAGES (MANDATORY AND RESPONSIVE)
-------------------------------------------------------
-USE high quility images ONLY FROM:
https://images.unsplash.com/
-DO NOT USE PLACEHOLDER IMAGES OR GENERIC STOCK IMAGES
-IMAGES MUST BE RELEVANT TO THE WEBSITE CONTENT
-every image URL MUST include:
?auto=formate&fit=crop&w=1200&q=80

images must :
-be responsive(max-width:100%)
-resize correctly on mobile
-never overflow containers

----------------------------------------------------------
TECHNICAL ABILITIES(VERY IMPORTENT)
----------------------------------------------------------
-Output one single html file
-exctly ONE <style> tag
-no external css js fonts
-use system-fonts only
-iframes srcdoc compatible
-spa-style navigation using javascript
-no page reloads
-no dead-ui
-no broken buttons
-----------------------------------------------------------
SPA-VISIBILITY RULE(MANDATORY)
-----------------------------------------------------------
-PAGES must no hidden perminetly
-if page{display:none} is used.
 then .page.active{display:block} is required
-atleast one page must be visible on initial load
-hidding all content is invali

-----------------------------------------------------------
REQUIRED SPA PAGES
----------------------------------------------------------
-Home
-About
-Services/Features
-Contact

----------------------------------------------------------
FUNCTIONAL REQUIREMENTS
----------------------------------------------------------
-Navigation must switch pages using js
-active nav state must update on page switch
-forms must have js validation
-buttons must have hover and active states
-smooth section/page transitions
 ----------------------------------------------------------
 FINAL SELF-CHECK(MANDATORY)
 ----------------------------------------------------------
 BEFORE RESPONDING ,ENSURE:
 1.Layout works on all screen sizes
 2.no horizontal scrolling on mobile
 3.all images are responsive and do not overflow
 4.media quires are present and used correctly
 4.navigation works without page reloads
 6.Atleast one page is visible without user interaction
 
 IF ANY CHECK FAILS-> RESPONSE IS INVALID
 
 --------------------------------------------------------
 OUTPUT FORMAT(RAW JSON ONLY)
 ---------------------------------------------------------
 {"message":"short professional confirmation sentence",
 "code":"<FULL VALID HTML CODE>"}
 
 --------------------------------------------------------
 ABSOLUTE RULES(MANDATORY)
 ---------------------------------------------------------
 -RETURN ONLY RAW JSON
 -NO markdown
 -NO EXPLANATIONS
 -no extra text
 -formate must match exactly as specified
 -IF FORMATE IS BROKEN-> RESPONSE IS INVALID`;

export async function GenerateWebSite(req, res) {
    try {
        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({
                message: "prompt is required"
            })
        }
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }
        if (user.credits < 50) {
            return res.status(400).json({ message: "insufficient credits" })
        }
        const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt)
        let raw = ""
        let parsed = null
        for (let i = 0; i < 3 && !parsed; i++) {
            raw = await generateResponse(finalPrompt, req, res)
            parsed = await extractJson(raw)
            if (!parsed) {
                raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON.", req, res)
                parsed = await extractJson(raw)
            }
        }
        if (!parsed?.code) {
            console.log("parsed.code is missing, raw response:", raw)
            return res.status(500).json({
                message: "website generation failed",
                error: "parsed.code is missing"
            })
        }
        const website = await Website.create({
            user: user._id,
            title: prompt.slice(0, 50),
            latestCode: parsed.code,
            conversation: [{ role: "user", content: prompt }, { role: "Ai", content: parsed.message }]
        })
        user.credits -= 50
        await user.save()
        return res.status(200).json({
            websiteId: website._id,
            remainingCredits: user.credits
        })


    }
    catch (error) {
        return res.status(500).json({
            message: "website generation failed",
            error: error.message
        })
    }

}

export async function getWebsiteById(req, res) {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        });
        if (!website) {
            return res.status(404).json({
                message: "website not found"
            })
        }
        return res.status(200).json(website)
    }
    catch (errror) {
        return res.status(500).json({ message: "failed to fetch website", error: errror.message })
    }

}

export async function Changes(req, res) {
    try {

        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({
                message: "prompt is required"
            })
        }
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        });
        if (!website) {
            return res.status(404).json({
                message: "website not found"
            })
        }
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }
        if (user.credits < 25) {
            return res.status(400).json({ message: "insufficient credits" })
        }
        const updatePrompt = `UPDATE THIS WEBSIT
    CURRENT CODE:
    ${website.latestCode}
    USER REQUEST:
    ${prompt}
    RETURN RAW JSON ONLY:
    {"message : "short confirmation",
    "code" : "<UPDATED FULL HTML >
    }`
        let raw = ""
        let parsed = null
        for (let i = 0; i < 3 && !parsed; i++) {
            raw = await generateResponse(updatePrompt, req, res)
            parsed = await extractJson(raw)
            if (!parsed) {
                raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON.", req, res)
                parsed = await extractJson(raw)
            }
        }
        if (!parsed.code) {
            console.log("parsed.code is missing, raw response:", raw)
            return res.status(500).json({
                message: "website generation failed",
                error: "parsed.code is missing"
            })
        }
        website.conversation.push({ role: "user", content: prompt }, { role: "Ai", content: parsed.message })
        website.latestCode = parsed.code
        await website.save()
        user.credits -= 25
        await user.save()
        return res.status(200).json({
            message: parsed.message,
            code:parsed.code,
            remainingCredits: user.credits
        })


    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "website updation failed",
            error: error.message
        })

    }
}



export async function getAllWeb(req,res) {
    try{
    const websites = await Website.find({user : req.user._id})
    return res.status(200).json(websites)
}
    catch(error){
        console.log(error)
        return res.status(500).json({
            message:"error to get user websites"
        })

    }
    
}

export async function DeployWebsite(req,res){
 try{
 const website = await Website.findOne({
    _id : req.params.id,
    user : req.user._id
 })
 if(!website){
    return res.status(404).json({
        message:"website not found"
    })
 }
 if(!website.slug){
    website.slug=website.title.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0,60)+website.
    _id.toString().slice(-5)
    await website.save();
 }
 website.deployed=true;
 website.deployUrl=`${process.env.VITE_DEPLOY_URL}/site/${website.slug}`
 await website.save();
 return res.status(200).json({
    message: "website deployed successfully",
    Url: website.deployUrl
 });
}
 catch(error){
    console.log(error)
    return res.status(500).json({
        message:"website deployment failed",
        error:error.message
    })

 }
}

export async function getLiveWebsite(req, res) {
    try {
        const website = await Website.findOne({
            slug: req.params.slug,
            deployed: true
        }).select("latestCode title");

        if (!website) {
            return res.status(404).json({ message: "website not found" });
        }

        return res.status(200).json(website);
    } catch (error) {
        return res.status(500).json({
            message: "failed to load website",
            error: error.message
        });
    }
}
