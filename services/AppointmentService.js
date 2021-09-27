let appointment = require("../models/Appointment");
let mongoose = require("mongoose");

const Appo = mongoose.model("Appointment",appointment)

class AppointmentService {
    async Create(name,email,description,cpf,date,time){
        let newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false
        });

        try{
            await newAppo.save();
            return true
        }catch(err){
            console.log(err);
            return false;
        }        
    }
}

module.exports = new AppointmentService();