using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Xml;

namespace InternshipWebApp.Helpers
{
    public class XmlHelper
    {
        public string GetValueOfAttribute(string attr, string str)
        {
            string guts = string.Empty;

            for (int ch = 0; ch < str.Length; ch++)
            {
                // if char is an tag opening
                if (str[ch].Equals('<'))
                {
                    ch = ch + 4;
                    if (str[ch].Equals(':'))
                    {
                        string tmp = string.Empty;

                        //take the name of attribute
                        for (int gt = 1; gt <= attr.Length; gt++)
                        {
                            tmp += str[ch + gt];
                        }

                        //create start of tags inside
                        int x = attr.Length + 1;

                        //if the attribute is the one we need
                        if (tmp == attr)
                        {

                            //load whole value of wanted attribute (intil another xml tag opener)
                            for (int y = 1; !(str[ch + x + y].Equals('<')); y++)
                            {
                                guts += str[ch + x + y];
                            }

                            //return value of given attribute
                            return guts;
                        }
                    }
                }
            }

            return "Pro toto ičo jsme nic nenašli";
        }
        public int GetIntOfAttribute(string attr, string str)
        {
            string guts = string.Empty;

            for (int ch = 0; ch < str.Length; ch++)
            {
                // if char is an tag opening
                if (str[ch].Equals('<'))
                {
                    ch = ch + 4;
                    if (str[ch].Equals(':'))
                    {
                        string tmp = string.Empty;

                        //take the name of attribute
                        for (int gt = 1; gt <= attr.Length; gt++)
                        {
                            tmp += str[ch + gt];
                        }

                        //create start of tags inside
                        int x = attr.Length + 1;

                        //if the attribute is the one we need
                        if (tmp == attr)
                        {

                            //load whole value of wanted attribute (intil another xml tag opener)
                            for (int y = 1; !(str[ch + x + y].Equals('<')); y++)
                            {
                                guts += str[ch + x + y];
                            }

                            //return value of given attribute
                            return Int32.Parse(guts);
                        }
                    }
                }
            }

            return 01;
        }
        public XmlDocument XmlURLToXmlDOC(string url)
        {
            //Create XmlDocument to work with
            XmlDocument xmlDoc = new XmlDocument();

            //Request the XML data from given url
            WebRequest httpReq = (HttpWebRequest)HttpWebRequest.Create(url);
            httpReq.Method = "GET";
            httpReq.ContentType = "text/xml; encoding='utf-8'";

            //Get response
            WebResponse httpRes = (HttpWebResponse)httpReq.GetResponse();

            //Load the response to XmlDocument
            XmlTextReader xmlRead = new XmlTextReader(httpRes.GetResponseStream());
            xmlDoc.Load(xmlRead);

            return xmlDoc;
        }
        public string XmlURLToString(string url)
        {
            //Create XmlDocument to woek with
            XmlDocument xmlDoc = new XmlDocument();

            //Load it with XML data from given url
            xmlDoc = XmlURLToXmlDOC(url);

            //Rewrite XML to plain string
            StringWriter sw = new StringWriter();
            XmlTextWriter xw = new XmlTextWriter(sw);
            xmlDoc.WriteTo(xw);

            return sw.ToString();
        }
    }
}
