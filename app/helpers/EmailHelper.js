const sgMail = require('@sendgrid/mail');

class EmailHelper {
    
    constructor() { 
        throw new Error('Esta classe não pode ser instanciada');
    }
    
    static sendEMail(from, to, subject, html) {
        sgMail.setApiKey('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');                
        const msg =  {
            from,
            to,
            subject,
            html 
        }; 
        sgMail.send(msg);
    }

}


module.exports = EmailHelper;