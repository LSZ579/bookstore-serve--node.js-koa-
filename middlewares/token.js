const jwt=require('jsonwebtoken')
const secretKey='gamercode'
exports.token={
    addToken:(user)=>{
        const token=jwt.sign(
            {
                user_id:user.user_id,
                user_name:user.user_name
            },
            secretKey,{expiresIn:10});
        return token;
    },
    decrypt:(token)=>{
        if(token){
            let toke=token.split(' ')[1];
            console.log('token!!:'+toke)
            let decoded=jwt.decode(toke,secretKey);
            return decoded;
        }
    }
}