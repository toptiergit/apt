using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Toptier.WMS.Web
{
    public class WMSSettings
    {
        #region control properties
        public static string DropDownListOptionLabel
        {
            get
            {
                return "";
            }
        }

        public static string DropDownListOptionLabelSearch
        {
            get
            {
                return "All";
            }
        }

        private static string ddlPartSelect2InputLength = System.Configuration.ConfigurationManager.AppSettings["DDLPartSelect2InputLength"];
        private static string ddlLocationSelect2InputLength = System.Configuration.ConfigurationManager.AppSettings["DDLLocationSelect2InputLength"];
        private static string ddlClientSelect2InputLength = System.Configuration.ConfigurationManager.AppSettings["DDLClientSelect2InputLength"];
        private static string ddlPOSelect2InputLength = System.Configuration.ConfigurationManager.AppSettings["DDLPOSelect2InputLength"];
        private static string ddlPODetailSelect2InputLength = System.Configuration.ConfigurationManager.AppSettings["DDLPODetailSelect2InputLength"];
        private static string ddlSOSelect2InputLength = System.Configuration.ConfigurationManager.AppSettings["DDLSOSelect2InputLength"];
        private static string ddlSODetailSelect2InputLength = System.Configuration.ConfigurationManager.AppSettings["DDLSODetailSelect2InputLength"];
        private static string ddlInvoiveSelect2InputLength = System.Configuration.ConfigurationManager.AppSettings["DDLInvoiceSelect2InputLength"];

        public static string DDLPartSelect2InputLength
        {
            get { return ddlPartSelect2InputLength; }
        }
        public static string DDLLocationSelect2InputLength
        {
            get { return ddlLocationSelect2InputLength; }
        }
        public static string DDLClientSelect2InputLength
        {
            get { return ddlClientSelect2InputLength; }
        }
        public static string DDLPOSelect2InputLength
        {
            get { return ddlPOSelect2InputLength; }
        }
        public static string DDLPODetailSelect2InputLength
        {
            get { return ddlPODetailSelect2InputLength; }
        }
        public static string DDLSOSelect2InputLength
        {
            get { return ddlSOSelect2InputLength; }
        }
        public static string DDLSODetailSelect2InputLength
        {
            get { return ddlSODetailSelect2InputLength; }
        }
        public static string DDLInvoiceSelect2InputLength
        {
            get { return ddlInvoiveSelect2InputLength; }
        }

        public static bool EnableMapFeature
        {
            get
            {
                bool Result = false;
                try
                {
                    string EnableMapFeature = System.Configuration.ConfigurationManager.AppSettings["EnableMapFeature"].ToString();
                    if (!string.IsNullOrEmpty(EnableMapFeature))
                    {
                        if (EnableMapFeature.ToUpper() == "TRUE")
                        {
                            Result = true;
                        }
                    }
                }
                catch{
                    Result = false;
                }
                return Result;
            }
        }
        #endregion end of control properties

        #region datetime
        private static string displayDateFormat = System.Configuration.ConfigurationManager.AppSettings["displayDateFormat"]; //http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx
        private static string displayTimeFormat = System.Configuration.ConfigurationManager.AppSettings["displayTimeFormat"];
        public static string DisplayDateFormat
        {
            get { return displayDateFormat; }
        }
        public static string DisplayTimeFormat
        {
            get { return displayTimeFormat; }
        }
        public static string DisplayDateTimeFormat
        {
            get { return string.Format("{0} {1}", displayDateFormat, displayTimeFormat); }
        }

        //important! the format for all must be the same result
        private static string inputDateFormat = System.Configuration.ConfigurationManager.AppSettings["InputDateFormat"]; //http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx
        private static string inputDateTimeFormat = System.Configuration.ConfigurationManager.AppSettings["InputDateTimeFormat"];
        private static string inputTimeFormat = System.Configuration.ConfigurationManager.AppSettings["InputTimeFormat"];
        private static string bootstrapDatePickerFormat = System.Configuration.ConfigurationManager.AppSettings["BootstrapDatePickerFormat"]; //http://bootstrap-datepicker.readthedocs.org/en/release/options.html#format
        private static string bootstrapDateTimePickerFormat = System.Configuration.ConfigurationManager.AppSettings["bootstrapDateTimePickerFormat"]; //http://eonasdan.github.io/bootstrap-datetimepicker/#example5
        private static string jqueryDatePickerFormat = System.Configuration.ConfigurationManager.AppSettings["JQueryDatePickerFormat"];
        private static string jqueryDateTimePickerFormat = System.Configuration.ConfigurationManager.AppSettings["JQueryDateTimePickerFormat"];
        public static string InputDateFormat
        {
            get { return inputDateFormat; }
        }

        public static string InputTimeFormat
        {
            get { return inputTimeFormat; }
        }
        public static string InputDateTimeFormat
        {
            //get { return string.Format("{0} {1}", inputDateFormat, inputTimeFormat); }
            get { return inputDateTimeFormat; }
        }

        public static string BootstrapDatePickerFormat
        {
            get { return bootstrapDatePickerFormat; }
        }
        public static bool BootstrapTimePickerUse24Hours
        {
            get { return inputTimeFormat.Contains("H"); }
        }
        public static string BootstrapDateTimePickerFormat
        {
            get { return bootstrapDateTimePickerFormat; }
        }
        public static string JQueryDatePickerFormat
        {
            get { return jqueryDatePickerFormat; }
        }
        public static string JQueryDateTimePickerFormat
        {
            get { return jqueryDateTimePickerFormat; }
        }
        #endregion

        #region Numberic
        private static string displayCurrencyFormat = ConfigurationManager.AppSettings["DisplayCurrencyFormat"];
        private static string displayNumberFormat = ConfigurationManager.AppSettings["DisplayNumberFormat"];
        private static int jqueryNumberCurrency = Convert.ToInt32(ConfigurationManager.AppSettings["JQueryNumberCurrency"]);
        private static int jqueryNumberNumber = Convert.ToInt32(ConfigurationManager.AppSettings["JQueryNumberNumber"]);
        public static string DisplayCurrencyFormat
        {
            get { return displayCurrencyFormat; }
        }
        public static string DisplayNumberFormat
        {
            get { return displayNumberFormat; }
        }

        public static int JQueryNumberCurrency
        {
            get { return jqueryNumberCurrency; }
        }
        public static int JQueryNumberNumber
        {
            get { return jqueryNumberNumber; }
        }
        #endregion End of Numberic

        private static bool autoIncomingInspection = Convert.ToBoolean(ConfigurationManager.AppSettings["AutoIncomingInspection"]);
        public static bool AutoIncomingInspection
        {
            get { return autoIncomingInspection; }
        }        
    }

}