using RestSharp;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace BMW.ClassLibrary.API
{
    public static class InventoryCustomApi
    {
        public static List<Models.InventoryCustom> GetClientMenu(string url)
        //public void GetClientMenu()
        {
            var client = new RestClient();
            client.BaseUrl = new Uri(url);

            var request = new RestRequest();
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");

            var response = client.Execute(request);
            if (response.StatusCode.ToString() == "NotFound")
                return null;

            var content = response.Content; // raw content as string 
            var menu = JsonConvert.DeserializeObject<List<Models.InventoryCustom>>(content);

            return menu;
        }

        public static Models.CustomLoginResult GetCustomLoginResult(string url,string user,string password)
        {
            var client = new RestClient();
            client.BaseUrl = new Uri(url);

            var request = new RestRequest();
            request.Method = Method.POST;
            request.AddHeader("Accept", "application/json");
            request.AddParameter("user", user);
            request.AddParameter("password", password);

            var response = client.Execute(request);
            if (response.StatusCode.ToString() == "NotFound")
                return null;

            var content = response.Content; // raw content as string 

            Models.CustomLoginResult customLoginResult = new Models.CustomLoginResult();
            try
            {
                customLoginResult = JsonConvert.DeserializeObject<Models.CustomLoginResult>(content);
                return customLoginResult;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
