document.addEventListener('DOMContentLoaded',() => {
    document.querySelector('form').onsubmit = function() {

        const recipients = document.querySelector('#compose-recipients').value;
        const subject = document.querySelector('#compose-subject').value;
        const body = document.querySelector('#compose-body').value;
        
        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: recipients,
                subject: subject,
                body: body,
                archived: false,
            })
        })
        .then(response => response.json())
        .then(result => {

            console.log(result);
            

        })
        load_mailbox('sent')
        return false;
    };

});
