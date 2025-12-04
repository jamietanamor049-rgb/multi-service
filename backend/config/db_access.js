import mongoose from 'mongoose';

export const dbConnection = async () => {
   try{
    await mongoose.connect(process.env.DB_ACCESS);

}catch(error){
    console.error("Error: "+error.message);
    process.exit(1);
}
mongoose.connection.on("connected", ()=>{
    console.log("Connected to database succesfully!")
});

mongoose.connection.on("error", (err)=>{
    console.error("Error while connection to database!"+err.message);
});

mongoose.connection.on("error", (err)=>{
    console.error("MongoDB disconnected!");
});

}



