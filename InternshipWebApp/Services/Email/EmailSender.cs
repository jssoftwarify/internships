using Microsoft.Extensions.Configuration;
using System;
using System.Net.Mail;
using System.Threading.Tasks;

namespace InternshipWebApp.Services.Email
{
    public class EmailSender
    {
        public IConfiguration Configuration { get; set; }
        private string _fromName;
        private string _from;
        private int _port;
        private string _server;
        private string _userName;
        private string _password;
        public EmailSender(IConfiguration configuration)
        {
            Configuration = configuration;
            _fromName = Configuration["EmailSender:FromName"];
            _from = Configuration["EmailSender:From"];
            _port = Convert.ToInt32(Configuration["EmailSender:Port"]);
            _server = Configuration["EmailSender:Server"];
            _userName = Configuration["EmailSender:Username"];
            _password = Configuration["EmailSender:Password"];
        }
        /*
        [Obsolete]
        public Task SendEmailAsync(string emailAddress, string subject, string text)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_fromName, _from));
            message.To.Add(new MailboxAddress(emailAddress));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.TextBody = text;
            bodyBuilder.HtmlBody = "<p style=\"color: red;\">" + text + "</p>";
            message.Body = bodyBuilder.ToMessageBody();
            /*
            using (var client = new SmtpClient())
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                client.Connect(_server, _port, MailKit.Security.SecureSocketOptions.StartTlsWhenAvailable);
                client.Authenticate(_userName, _password);
                client.Send(message);
                client.Disconnect(true);
                return Task.FromResult(0);
            }
            
        }
    */
    }
}
