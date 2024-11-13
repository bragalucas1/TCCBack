const multer = require("multer");
const path = require("path");
const fs = require("fs");

const baseUploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req.body);
    const activityName = req.body.nome || "CargaAlunos";
    const activityDir = path.join(baseUploadDir, activityName);

    // console.log("Arquivo recebido:", file);
    // console.log("Diretório de destino:", activityDir);

    if (!fs.existsSync(activityDir)) {
      fs.mkdirSync(activityDir, { recursive: true });
    }

    cb(null, activityDir);
  },
  filename: function (req, file, cb) {
    if(req.body.perfilSubmissao === 'aluno'){
      const uniqueSuffix = `${req.body.nomeUsuario}-${file.originalname}`;
      return cb(null, uniqueSuffix);
    }
    
    const uniqueSuffix = file.originalname;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|py|txt/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    return cb(null, true);
  }
  cb(new Error("Apenas arquivos PDF, PY e TXT são permitidos!"));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
