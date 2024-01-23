const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadcontact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContact,
} = require("./utils/contact");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3001;

//using ejs
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: " mhs 1",
      email: "mhs1@gmail.com",
    },
    {
      nama: " mhs 2",
      email: "mhs2@gmail.com",
    },
    {
      nama: " mhs 3",
      email: "mhs3@gmail.com",
    },
  ];
  res.render("index", {
    layout: "layouts/template",
    title: "index page",
    mahasiswa,
  });
});

app.get("/about", (req, res) => {
  res.render("about", { layout: "layouts/template", title: "about page" });
});

app.get("/contact", (req, res) => {
  const contacts = loadcontact();
  res.render("contact", {
    layout: "layouts/template",
    title: "contact page",
    data: contacts,
    msg: req.flash("msg"),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/template",
    title: "contact page",
  });
});

app.post(
  "/contact",
  [
    check("email", "email tidak valid").isEmail(),
    check("nohp", "no hp tidak valid").isMobilePhone("id-ID"),
    body("nama").custom((value) => {
      const duplicate = cekDuplikat(value);
      if (duplicate) {
        throw new Error("nama sudah terdafar");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({errors:errors.array()});
      res.render("add-contact", {
        layout: "layouts/template",
        title: "form add contact page",
        errors: errors.array(),
      });
    }
    addContact(req.body);
    req.flash("msg", "success add !");
    res.redirect("/contact");
  }
);

app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  if (!contact) {
    res.status(404);
    res.send("not found");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "success delete !");
    res.redirect("/contact");
  }
});

app.get("/contact/:id", (req, res) => {
  const contact = findContact(req.params.id);

  res.render("details", {
    layout: "layouts/template",
    title: "contact page",
    data: contact,
  });
});

app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("edit-contact", {
    layout: "layouts/template",
    title: "edit contact page",
    data: contact,
  });
});

app.post(
  "/contact/update",
  [
    check("email", "email tidak valid").isEmail(),
    check("nohp", "no hp tidak valid").isMobilePhone("id-ID"),
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if ( value !== req.body.oldNama && duplikat) {
        throw new Error("nama sudah terdafar");
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({errors:errors.array()});
      res.render("edit-contact", {
        layout: "layouts/template",
        title: "form edit contact page",
        errors: errors.array(),
        data : req.body,
      });
    }
    updateContact(req.body);
    req.flash("msg", "success update !");
    res.redirect("/contact");
  }
);

app.use("/", (req, res) => {
  res.status(404);
  res.send("<p> 404 Not Found</p>");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://127.0.0.1:${port}`);
});
