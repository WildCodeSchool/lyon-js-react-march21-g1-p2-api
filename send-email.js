const handleEmailSubmit = (event) => {
    event.preventDefault();
    emailer.sendMail(
      {
        from: 'maupied69@hotmail.com',
        to: 'maupied69@hotmail.com',
        subject: "Vous avez recu un message de la part d'un utilisateur",
        text: `${emailFname}${emailLname}\n${emailMessage}`,
        html: `<p>${emailFname}${emailLname}\n${emailMessage}</p>`,
      },
      (err, info) => {
        if (err) console.error(err);
        else console.log(info);
      }
    );
  };