document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views, argument passed in load_mailbox is the name you wanna show
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(obj) {
console.log("hello")
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#detailed-view').style.display = 'none';
  
  let bool = document.querySelector('.reply').getAttribute('data-bool');
  
  if(bool === "true"){
    fetch(`/emails/${obj}`)
    .then(response => response.json())
    .then(reply => {
      document.querySelector('#compose-recipients').value = reply.sender;
      document.querySelector('#compose-subject').value = `Re: ${reply.subject}`;
      document.querySelector('#compose-body').value = `On ${reply.timestamp} ${reply.sender} wrote: ${reply.body}.`;
    });

  }else{
    // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  };
};






function load_mailbox(mailbox) {
  
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#detailed-view').style.display = 'none';

  // Show the mailbox name
  // here ${} includes a way by which first char is capitalized and rest is added to it
  document.querySelector('#emails-view').innerHTML = `<h3 class = "head">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // fetch data from given url
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    // console.log(emails);
    
    // as emails is an object, to loop over inside data use for each
    emails.forEach(email => {

      // create an Element
      let div = document.createElement('div');
      let br = document.createElement('span');

      // add class to a created element
      div.classList.add('card');

      
      // modify inside part of created element br
      br.innerHTML = `<br>`

      if (mailbox === "inbox"){
        
        if(email.read === true){
          div.style.background = "grey";
          }
        // here onlick is a function so no need to put ${} to insert function and its argument
        if(email.archived === false){
          div.innerHTML = 
                `<div class = "email-block un_ar" data-val = "true">
                <div class ='card-header'>
                <a class="de">From: </a><a class="view-mail" onclick = viewemail(this) data-id = "${email.id}">${email.sender}</a>
                </div>
                <div class = 'card-body'>
                <blockquote class="blockquote mb-0">
                <p>
                Subject: <cite title="Source Title">${email.subject}</cite>
                </p>
                <footer class="blockquote-footer">
                Time:<cite title="Source Title"> ${email.timestamp}</cite></a>
                </footer>
                </blockquote>
                </div>`;}

      }else if(mailbox === "sent"){
        div.innerHTML = 
                `<div class = "email-block un_ar" data-val = "hide">
                <div class ='card-header'>
                <a class="de">To: </a><a class="view-mail" onclick = viewemail(this) data-id = "${email.id}"> ${email.recipients}</a>
                </div>
                <div class = 'card-body'>
                <blockquote class="blockquote mb-0">
                <p>
                Subject: <cite title="Source Title">${email.subject}</cite>
                </p>
                <footer class="blockquote-footer">
                Time:<cite title="Source Title"> ${email.timestamp}</cite></a>
                </footer>
                </blockquote>
                </div>`;
      }else if(mailbox === "archive"){
        if(email.archived === true){
          div.innerHTML = 
                `<div class = "email-block un_ar" data-val = "false">
                <div class ='card-header'>
                <a class="de">From: </a><a class="view-mail" onclick = viewemail(this) data-id = "${email.id}">${email.sender}</a>
                </div>
                <div class = 'card-body'>
                <blockquote class="blockquote mb-0">
                <p>
                Subject: <cite title="Source Title">${email.subject}</cite>
                </p>
                <footer class="blockquote-footer">
                Time:<cite title="Source Title"> ${email.timestamp}</cite></a>
                </footer>
                </blockquote>
                </div>`;}
      }

      // add entire created element to #email-view
      document.querySelector('#emails-view').append(div);
      document.querySelector('#emails-view').append(br);
      
    });
  });
};






let div_ = document.createElement('div');





// here data-id is the attribute inside html, to get data from it user .getAttribute
function viewemail(view){
  let val = document.querySelector('.un_ar').getAttribute('data-val');
  let button;
  if(val === "true"){
    button = "Archive"
  }else{
    button = "Unarchive"
  }

  let id = view.getAttribute("data-id");
  console.log(val);
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(maildata => {

    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#detailed-view').style.display = 'block';

    div_.classList.add('card');
    if(val === "hide"){
      div_.innerHTML = 
      `<div class = "email-block">
      <div class ='card-header'>
      <a class="de">Sender: </a><a class="view-mail"> ${maildata.sender}</a><br>
      <a class="de">Recipients: </a><a class="view-mail"> ${maildata.recipients}</a>
      </div>
      <footer class="blockquote-footer">
      Subject:<cite title="Source Title"> ${maildata.subject}</cite></a>
      <br>
      Time:<cite title="Source Title"> ${maildata.timestamp}</cite></a>
      </footer>
      <div class = 'card-body'>
      <blockquote class="blockquote mb-0">
      <p>
      <cite title="Source Title">${maildata.body}</cite>
      </p>
      </blockquote>
      </div>`;

    }else{

      div_.innerHTML = 
      `<div class = "email-block">
      <div class ='card-header'>
      <a class="de">Sender: </a><a class="view-mail"> ${maildata.sender}</a><br>
      <a class="de">Recipients: </a><a class="view-mail"> ${maildata.recipients}</a>
      </div>
      <footer class="blockquote-footer">
      Subject:<cite title="Source Title"> ${maildata.subject}</cite></a>
      <br>
      Time:<cite title="Source Title"> ${maildata.timestamp}</cite></a>
      </footer>
      <div class = 'card-body'>
      <blockquote class="blockquote mb-0">
      <p>
      <cite title="Source Title">${maildata.body}</cite>
      </p>
      </blockquote>
      <a onclick = archieve(${maildata.id}) data-bool = ${val} class="btn btn-secondary boo">${button}</a>
      <a onclick = compose_email(${maildata.id}) data-bool="true" class="btn btn-secondary reply">Reply</a>
      </div>`;
    }
    

      // here since this functions needs to be updated with respect to id,
      //  and previous data shld be overwrittern, create div and save it globally and acces inside
      //  this function so that div is not created again and again
      document.querySelector('#detailed-view').append(div_);
      // console.log(maildata.id);
      // console.log(maildata.read)
      // console.log(maildata.archived);
      fetch(`/emails/${maildata.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })
  })
  
};






function archieve(id){

  let bool = document.querySelector('.boo').getAttribute('data-bool');

  if(bool === "true"){
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true,
              
          })
          
        });
  }else{

        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: false,
              
          })
          
        });
}

  load_mailbox('inbox');

}


