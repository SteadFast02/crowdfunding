import e2ee from "./utils/e2ee.js";

// Admin 

// const dataToEncrypt = {
//     username:"admin",
//     email:"admin@gmail.com",
//     password:"admin"
// };

const dataToEncrypt = {
    email:"subadmin1@gmail.com",
    password:"subadmin1"
};

// const EncryptData = e2ee.encrypt(dataToEncrypt);
// console.log("Encrypted Data:",EncryptData)

// Decrypted Data
const dataToDecrypt = "8d66760285bd3bef9176d73215d8be0be419bde58f89e27acbe490895b5229c90d2177d2321bd8509d87b06e4836ebf146177632fc3cc8b36d06d2fd9cf65c9d106da86ed6b614a18c2e2a69124e1c61d6044d5f3fe32676a533f2d6d72f8afa4512dc76f98a31f1c2075efd002e719937917320d3e23333f79260a314fea4838b40a2adce2866bb200147eb21265d9c6994e336bd2db2fa0fca2d563a2218396ec8c61770ae998929a4b465620805bed86fa0856e24bdfc6512feb796de6ec669185bb6d9349cdefc1e24c97a01a144b919a62644e6699d1d7a8a3a468785809087923c785e78a24c3f2f22187fdaca9f04069500ec2e108b06d8c5f8662d60"

const decryptData = e2ee.decrypt(dataToDecrypt)
console.log("Decrypted Data:",decryptData)
