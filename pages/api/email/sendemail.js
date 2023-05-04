var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.apikeysendinblue;

// Uncomment below two lines to configure authorization using: partner-key
// var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = 'YOUR API KEY';

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

export default async (req,res)=>{
    switch(req.method){
        case "POST":
          await sendEmail(req,res)
          break;
    }
}

const sendEmail = async (req, res) => {
    const {
        email,
        lastname,
        name,
        phone,
        message
    } = req.body
    console.log("data email", req.body)
    try{
        sendSmtpEmail = {
            to: [{
                email: email,
                name: `${lastname} ${name}`
            }],
            templateId: 1,
            params: {
                name: name,
                lastname: lastname,
                phone:phone,
                message: message
            },
            headers: {
                'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
                'api-key': process.env.APIKEYSENDINBLUE,
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
          console.log('API called successfully. Returned data: ' + JSON.stringify(data));
          res.json({
            data : JSON.stringify(data)
        })
        }, function(error) {
          console.error(error);
        });
    }
    catch(err){
        console.log("email error", err)
    }
}