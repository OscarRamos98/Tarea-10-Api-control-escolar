const router = require('express').Router();

const mongoose = require('mongoose');
var status = require('http-status');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Student = require('../models/student.model');

module.exports = () => {

    //----------------------------Insertar estudiante-------------------------------------
    router.post('/', (req, res) => {
        student = req.body;
        //console.log(req);
        Student.create(student)
            .then(
                (data) => {
                    res.json(
                        {
                            code: status.OK,
                            msg: 'Se insertó correctamente',
                            data: data
                        }
                    )
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json(
                            {
                                code: status.BAD_REQUEST,
                                msg: 'Ocurrió un error',
                                err: err.name,
                                detal: err.message
                            }
                        )
                }
            );
    });

    //---------------Eliminar por numero de control----------------------
    router.delete("/:controlnumber", (req, res) => {
        const controlnumber = req.params.controlnumber;

        Student.findOneAndDelete({ controlnumber: controlnumber })
            .then((students) => {
                if (students)
                    res.json({
                        code: status.OK,
                        msg: "Se eliminó correctamente",
                        data: students,
                    });
                else
                    res.status(status.NOT_FOUND).json({
                        code: status.NOT_FOUND,
                        msg: "No se encontró el elemento",
                    });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });
    //------------------Consulta general----------------------
    router.get("/", (req, res) => {
        Student.find({})
            .then((students) => {
                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: students,
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    //------------------------Consulta por numero de control----------------------
    router.get("/:controlnumber", (req, res) => {
        Student.findOne({ controlnumber: req.params.controlnumber })
            .then((student) => {
                if (student)
                    res.json({
                        code: status.OK,
                        msg: "Consulta correcta",
                        data: student,
                    });
                else
                    res.status(status.NOT_FOUND).json({
                        code: status.NOT_FOUND,
                        msg: "No se encontró el elemento",
                    });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    //-------------Actualizar por numero de control----------------------
    router.put("/:controlnumber", (req, res) => {
        const controlnumber = req.params.controlnumber;
        const student = req.body;

        Student.findOneAndUpdate({ controlnumber: controlnumber }, student, {
            new: true,
        })
            .then((students) => {
                res.json({
                    code: status.OK,
                    msg: "Se actualizó correctamente",
                    data: students,
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST);
                res.json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la aplicación",
                    err: err.name,
                    detail: err.message,
                });
            });
    });


    //----------------Estadistica de estudiantes hombres y mujeres por carrera
    router.post("/EstHyM/", (req, res) => {
        Student.find({})
            .then((students) => {
                careers = {
                    ISC: { Hombres: 0, Mujeres: 0 },
                    IM: { Hombres: 0, Mujeres: 0 },
                    IGE: { Hombres: 0, Mujeres: 0 },
                    IC: { Hombres: 0, Mujeres: 0 },
                };

                students.forEach((student) => {
                    if (student.career === "ISC") {
                        [...student.curp][10] === "M"
                            ? careers.ISC.Mujeres++
                            : careers.ISC.Hombres++;
                    }
                    if (student.career === "IM") {
                        [...student.curp][10] === "M"
                            ? careers.IM.Mujeres++
                            : careers.IM.Hombres++;
                    }
                    if (student.career === "IGE") {
                        [...student.curp][10] === "M"
                            ? careers.IGE.Mujeres++
                            : careers.IGE.Hombres++;
                    }
                    if (student.career === "IC") {
                        [...student.curp][10] === "M"
                            ? careers.IC.Mujeres++
                            : careers.IC.Hombres++;
                    }
                });

                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: careers,
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });


    //------------------------Estadistica de estudiantes foraneos
    router.post("/Foraneos/", (req, res) => {
        Student.find({})
            .then((students) => {
                careers = {
                    ISC: { Foraneos: 0 },
                    IM: { Foraneos: 0 },
                    IGE: { Foraneos: 0 },
                    IC: { Foraneos: 0 },
                };

                students.forEach((student) => {
                    if (student.career === "ISC") {
                        [...student.curp][11] === "N" && [...student.curp][12] === "T"
                            ? null
                            : careers.ISC.Foraneos++;
                    }
                    if (student.career === "IM") {
                        [...student.curp][11] === "N" && [...student.curp][12] === "T"
                            ? null
                            : careers.IM.Foraneos++;
                    }
                    if (student.career === "IGE") {
                        [...student.curp][11] === "N" && [...student.curp][12] === "T"
                            ? null
                            : careers.IGE.Foraneos++;
                    }
                    if (student.career === "IC") {
                        [...student.curp][11] === "N" && [...student.curp][12] === "T"
                            ? null
                            : careers.IC.Foraneos++;
                    }
                });

                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: careers,
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    //------------------------Estadistica de estudiantes aprobados y no aprobados
    router.post("/Aprobados/", (req, res) => {
        Student.find({})
            .then((students) => {
                careers = {
                    ISC: { Aprobados: 0, NAprobados: 0 },
                    IM: { Aprobados: 0, NAprobados: 0 },
                    IGE: { Aprobados: 0, NAprobados: 0 },
                    IC: { Aprobados: 0, NAprobados: 0 },
                };

                students.forEach((student) => {
                    if (student.career === "ISC") {
                        student.grade >= 70 ? careers.ISC.Aprobados++ : null;
                    }
                    if (student.career === "ISC") {
                        student.grade < 70 ? careers.ISC.NAprobados++ : null;
                    }

                    if (student.career === "IM") {
                        student.grade >= 70 ? careers.IM.Aprobados++ : null;
                    }
                    if (student.career === "IM") {
                        student.grade < 70 ? careers.IM.NAprobados++ : null;
                    }
                    if (student.career === "IGE") {
                        student.grade >= 70 ? careers.IGE.Aprobados++ : null;
                    }
                    if (student.career === "IGE") {
                        student.grade < 70 ? careers.IGE.NAprobados++ : null;
                    }
                    if (student.career === "IC") {
                        student.grade >= 70 ? careers.IC.Aprobados++ : null;
                    }
                    if (student.career === "IC") {
                        student.grade < 70 ? careers.IC.NAprobados++ : null;
                    }
                });

                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: careers,
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    //------------------------Estadistica de estudiantes mayores y menores de edad
    router.post("/Edades/", (req, res) => {
        Student.find({})
            .then((students) => {
                careers = {
                    ISC: { Mayores: 0, Menores: 0 },
                    IM: { Mayores: 0, Menores: 0 },
                    IGE: { Mayores: 0, Menores: 0 },
                    IC: { Mayores: 0, Menores: 0 },
                };

                students.forEach((student) => {
                    if (student.career === "ISC") {
                        [...student.curp][4] === "0" && parseInt([...student.curp][5]) > 3
                            ? careers.ISC.Menores++
                            : careers.ISC.Mayores++;
                    }
                    if (student.career === "IM") {
                        [...student.curp][4] === "0" && parseInt([...student.curp][5]) > 3
                            ? careers.IM.Menores++
                            : careers.IM.Mayores++;
                    }
                    if (student.career === "IGE") {
                        [...student.curp][4] === "0" && parseInt([...student.curp][5]) > 3
                            ? careers.IGE.Menores++
                            : careers.IGE.Mayores++;
                    }
                    if (student.career === "IC") {
                        [...student.curp][4] === "0" && parseInt([...student.curp][5]) > 3
                            ? careers.IC.Menores++
                            : careers.IC.Mayores++;
                    }
                });

                res.json({
                    code: status.OK,
                    msg: "Consulta correcta",
                    data: careers,
                });
            })
            .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                    code: status.BAD_REQUEST,
                    msg: "Error en la petición",
                    err: err.name,
                    detail: err.message,
                });
            });
    });

    return router;
}