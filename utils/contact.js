const fs = require("fs");

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const dataPath = "./data/contacts.json";

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadcontact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

const findContact = (nama) => {
  const contacts = loadcontact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );

  return contact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};
const addContact = (contact) => {
  const contacts = loadcontact();

  contacts.push(contact);
  saveContacts(contacts);
};

const cekDuplikat = (nama) => {
  const contacts = loadcontact();
  return contacts.find((contact) => nama === contact.nama);
};

const deleteContact = (nama) => {
  const contacts = loadcontact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);

  saveContacts(filteredContacts);
};

const updateContact = (newContact) => {
    const contacts = loadcontact();

    const filteredContacts = contacts.filter((contact) => contact.nama !== newContact.oldNama);
    delete newContact.oldNama;
   filteredContacts.push(newContact);
   saveContacts(filteredContacts);

};

module.exports = {
  loadcontact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContact,
};
