using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace BMW.ClassLibrary.API
{
    public static class Helper
    {
        public static bool IsNull<T>(this T root, Expression<Func<T, object>> getter)
        {
            var visitor = new IsNullVisitor();
            visitor.CurrentObject = root;
            visitor.Visit(getter);
            return visitor.IsNull;
        }

        private static IDictionary<string, string> mimeMappings = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase) {
        {".gif", "image/gif"},
        {".jpg", "image/jpeg"},
        {".jpeg", "image/jpeg"},
        {".png", "image/png"},
        };

        public static string GetMimeType(string extension)
        {
            if (!extension.StartsWith("."))
                extension = "." + extension;

            string mime;
            return mimeMappings.TryGetValue(extension, out mime) ? mime : "application/octet-stream";
        }
        public static string GetExtension(string mimeType)
        {
            if (mimeMappings.Any(x => x.Value.ToLower() == mimeType.ToLower()))
                return mimeMappings.FirstOrDefault(x => x.Value.ToLower() == mimeType.ToLower()).Key;
            else
                return ".txt";
        }

        public static DateTime? DateTimeValidate(string dte, string format)
        {
            DateTime dt;
            string[] formats = { format };
            if (DateTime.TryParseExact(dte, formats, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out dt))
            {
               return DateTime.ParseExact(dte, format, System.Globalization.CultureInfo.InvariantCulture);                
            }
            else
            {
                return null;
            }
        }

    }

    public class License
    { 
        public string[] GetLicense(string licenseKey)
        {
            var lincense = new Toptier.LicenseManager.LicenseInfo(licenseKey);

            if (lincense == null)
                return null;

            string[] arr = new string[8];
            arr[0] = (lincense.ExpireDate!=null ? lincense.ExpireDate.Value.ToString("dd-MM-yyyy HH:mm")  : "");
            arr[1] = lincense.LicenseKey;
            arr[2] = lincense.MACAddress;
            arr[3] = lincense.MachineName;
            arr[4] = lincense.MaximumNumberOfEnabledUser.ToString();
            arr[5] = lincense.MaximumNumberOfUser.ToString();
            arr[6] = lincense.Remark;
            arr[7] = lincense.Signature;

            return arr;
        }
    }
    
    public class IsNullVisitor : ExpressionVisitor
    {
        public bool IsNull { get; private set; }
        public object CurrentObject { get; set; }

        protected override Expression VisitMember(MemberExpression node)
        {
            base.VisitMember(node);
            if (CheckNull())
            {
                return node;
            }

            var member = (PropertyInfo)node.Member;
            CurrentObject = member.GetValue(CurrentObject, null);
            CheckNull();
            return node;
        }

        private bool CheckNull()
        {
            if (CurrentObject == null)
            {
                IsNull = true;
            }
            return IsNull;
        }       
    }
}
