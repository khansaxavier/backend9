const connection = require('../db/db')

module.exports = {
    getNilaiByNim : (req, res) => {
        const qstring = `SELECT matakuliah.kdMk, matakuliah.matakuliah, nilai.dosen,
                                matakuliah.sks, nilai.semester, nilai.nilai
                        FROM nilai
                        INNER JOIN matakuliah
                        ON nilai.kdMk = matakuliah.kdMk
                        WHERE nilai.nim = ${req.params.nim};`;
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message : err.message || "Terjadi kesalahan saat get data"
                });
            }
            else res.send(data)
        });
    },
    addNilai : (req, res) => {
        const {nim, kdMk, semester, dosen, nilai} = req.body
        const qstring =  `INSERT INTO nilai (nim, kdMk, semester, dosen, nilai)
                          VALUE (?, ?, ?, ?, ?)`;
        const values = [nim, kdMk, semester, dosen, nilai];
    
        connection.query(qstring, values, (err, data) => {
          if (err) {
            console.log("error:", err);
            res.status(500).send({
                message : err.message || "terjadi kesalahan saat menambahkan data"
            });
        }
        else res.send(data)
        })
      },
    
      updateNilai: (req,res) =>{
        const{nim, kdMk, semester, dosen, nilai} = req.body;
        const qstring = `UPDATE nilai
                          SET dosen = ?, nilai = ?
                          WHERE nim = ? AND kdMk = ? AND semester = ?`;
        const values =  [dosen, nilai, nim, kdMk, semester];
    
        connection.query(qstring, values, (err, data) => {
          if (err) {
            console.log("error:", err);
            res.status(500).send({
                message : err.message || "terjadi kesalahan saat mengupdate data"
            });
        }
        else res.send(data)
        })
      },
    
      deleteNilai: (req, res) => {
        const {nim, kdMk, semester} = req.body;
        const qstring = `DELETE from nilai
                        WHERE nim = ? AND kdMk = ? AND semester = ?;`;
        const values = [nim, kdMk, semester];
    
        connection.query(qstring , values, (err, data) => {
          if (err) {
            console.log("error:", err);
            res.status(500).send({
                message : err.message || "terjadi kesalahan saat menghapus nilai"
            });
        }
        else res.send(data)
        })
      }
    }
