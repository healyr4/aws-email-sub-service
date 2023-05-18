const sendgrid = require("@sendgrid/mail");
const axios = require("axios");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const GET_FACTS_URL = "https://epxug9qvi1.execute-api.eu-west-1.amazonaws.com/dev/facts"
const GET_SUBS_URL = "https://epxug9qvi1.execute-api.eu-west-1.amazonaws.com/dev/get-subs"

module.exports.sendEmail = async(event) => {
    
    const randomFact = await getRandomFact();
    const emailHtml = createEmailHtml(randomFact);
    const subsList = await getSubs();

    try{
        await sendgrid.sendMultiple({
            to: [subsList],
            // Change --------------------------- 
            from: "your-email@gmail.com",
            subject: `[Fact for Today]`,
            text: "Did you know?",
            html: emailHtml,

        })
    } catch(error) {
        return {
            // Internal Server Error
            statusCode: 500,
            body: JSON.stringify( {error: error.message})
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify( {message: "Ok!"})
    }
}

const getSubs = async () => {
    const subs = await axios.get(GET_SUBS_URL);
    var subsList = [];
    subs.data.map((subscriber) => {
        subsList.push(subscriber.email);
    })

    return subsList;
}

const getRandomFact = async () => {
    // Get random fact from the list of facts
    const getFacts = await axios.get(GET_FACTS_URL);
    var length = getFacts.data.facts.length;
    var randomFact = getFacts.data.facts[Math.floor(Math.random() * length)];

    return randomFact;

}

const createEmailHtml = (randomFact) => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
   
    
    <body>
      <div class="container", style="min-height: 40vh;
      padding: 0 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;"> 
       <div class="card" style="margin-left: 20px;margin-right: 20px;">
          <div style="font-size: 14px;">
          <div class='card' style=" background: #f0c5c5;
          border-radius: 5px;
          padding: 1.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;">
      
        <p>${randomFact.fact}</p>
      
    </div>
          <br>
          </div>
          
         
          <div class="footer-links" style="display: flex;justify-content: center;align-items: center;">
            <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">Unsubscribe?</a>
            <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">About Us</a>
         
          </div>
          </div>
      
            </div>
           
    </body>
    </html>`;
};
