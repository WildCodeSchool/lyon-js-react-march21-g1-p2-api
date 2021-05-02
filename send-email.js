const emailer = require ('./emailer')

const handleEmailSubmit = () => {
    
    emailer.sendMail(
      {
        from: 'joris-maupied_student2021@wilder.school',
        to: 'maupiedjoris@gmail.com',
        subject: "Vous avez recu un message de la part d'un utilisateur",
        text: 'test',
        html: '<p>test</p>',
      },
      (err, info) => {
        if (err) console.error(err);
        else console.log(info);
      }
    );
  };

  handleEmailSubmit();
  module.exports = handleEmailSubmit;