let appointment = require("../models/Appointment");
let mongoose = require("mongoose");
let AppointmantFactory = require("../factories/AppointmantFactory");
let nodemailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appointment)

class AppointmentService {
    async Create(name, email, cpf, description, date, time) {
        let newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();
            return true
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async GetAll(showFinished) {
        if (showFinished) {
            return await Appo.find();
        } else {
            let appos = await Appo.find({ 'finished': false });
            let appointments = [];

            appos.forEach(appointment => {
                if (appointment.date != undefined) {
                    appointments.push(AppointmantFactory.Build(appointment));
                }
            });

            return appointments;
        }
    }

    async GetById(id) {
        try {
            let event = await Appo.findOne({ '_id': id });
            return event;
        } catch (err) {
            console.log(err);
        }
    }

    async Finish(id) {
        try {
            await Appo.findByIdAndUpdate(id, { finished: true });
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }
    }

    async Search(query) {
        try {
            let appos = await Appo.find().or([{ email: query }, { cpf: query }]);
            return appos;
        } catch (err) {
            console.log(err)
            return [];
        }
    }

    async SendNotification() {
        let appos = await this.GetAll(false);

        let transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "30392e94916ceb",
                pass: "23c62bac4db258"
            }
        });

        appos.forEach(async app => {

            let date = app.start.getTime();
            let hour = 1000 * 60 * 60;
            let gap = date - Date.now();

            if (gap <= hour) {

                if (!app.notified) {
                    await Appo.findByIdAndUpdate(app.id,{notified: true});
                    transport.sendMail({
                        from: "Adriano Winchester <adriano.santos.winchester@gmail.com>",
                        to: app.email,
                        subject: "Sua consulta esta proxima, não esqueça!",
                        text: "Sua consulta foi confrimada. Ira acontecer em 1H"
                    }).then(()=>{

                    }).catch(err =>{

                    })
                }

            }

        });

    }
}

module.exports = new AppointmentService();