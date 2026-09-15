

export async function getCurrentUser(req,res){
try{
    if(!req.user){
        return res.status(401).json({user:null});

    }
    res.status(200).json({user:req.user});

}
catch(error){
    console.error(error);
    res.status(500).json({message:`get current user failed: ${error}`});
}
}    

