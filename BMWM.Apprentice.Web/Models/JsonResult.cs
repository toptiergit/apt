namespace ApplicationForm.Models
{
    public class JsonResult
    {
        public JsonResult()
        {
            success = false;
            error = new JsonResultError();
        }
        public JsonResult(bool _success)
        {
            success = _success;
            error = new JsonResultError();
        }
        public JsonResult(bool _success, object _data)
        {
            success = _success;
            data = _data;
            error = new JsonResultError();
        }
        public JsonResult(bool _success, object _data, string _errorCode)
        {
            success = _success;
            data = _data;
            error = new JsonResultError() { code = _errorCode };
        }
        public JsonResult(bool _success, object _data, string _errorCode, string _errorMessage)
        {
            success = _success;
            data = _data;
            error = new JsonResultError() { code = _errorCode, message = _errorMessage };
        }
        public bool success { get; set; }
        public object data { get; set; }
        public JsonResultError error { get; set; }
    }

    public class JsonResultError
    {
        public JsonResultError()
        {
            code = string.Empty;
            message = string.Empty;
        }
        public string code { get; set; }
        public string message { get; set; }
    }
}