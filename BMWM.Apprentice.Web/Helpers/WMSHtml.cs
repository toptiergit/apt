using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;
using Toptier.Web.Resource;
using System.Xml;
using BMWM.Apprentice.Web.AuthWebService;
using BMWM.Apprentice.Web.AuthService;

namespace ApplicationForm.Helpers
{
    public class WMSHtml
    {
        public static MvcHtmlString MenuItem(string id, string text, string url, string itemCodeKey, bool hasSub = false, string faIcon = "fa-caret-right", string target = "")
        {
            bool pass = false;
            //Get itemcode
            string itemcode = System.Configuration.ConfigurationManager.AppSettings[itemCodeKey];
            if (string.IsNullOrEmpty(itemCodeKey) || string.IsNullOrEmpty(itemcode))
            {
                pass = true;
            }
            else
            {
                if (UserAuthentication.HttpSessionAlive)
                {
                    pass = UserAuthentication.IsAuthorizedItem(itemcode);
                }
            }

            string returnTag = "";
            if (pass)
            {
                if (!string.IsNullOrEmpty(target)) target = "target='" + target + "'";
                if (string.IsNullOrEmpty(url)) url = "javascript:;";
                returnTag = String.Format("<a id='menu-item-{4}' href='{0}' class='" + (hasSub ? "dropdown-toggle" : "") + "' {1}><i class='menu-icon  {2}'></i><span class='menu-text'> {3} </span>" + (hasSub ? "<b class='arrow fa fa-angle-down'></b>" : "") + "</a><b class='arrow'></b>", url, target, faIcon, text, id);
            }
            return new MvcHtmlString(returnTag);
        }

        public static MvcHtmlString CustomMenu()
        {
            var menuConfigFile = HttpContext.Current.Server.MapPath("~/App_Data/MenuConfig.xml");
            List<Menu> menus = new List<Menu>();
            if (File.Exists(menuConfigFile))
            {
                XDocument doc = XDocument.Load(menuConfigFile);
                XElement root = doc.Root;

                XElement customMenus = root.Element("customMenus");
                if (customMenus != null)
                {
                    foreach (XElement menu in customMenus.Elements("menu"))
                    {
                        string id = menu.Attribute("id")?.Value;
                        if (!string.IsNullOrEmpty(id))
                        {
                            string itemCodeKey = menu.Attribute("itemCodeKey")?.Value;
                            bool pass = false;
                            //Get itemcode
                            string itemcode = System.Configuration.ConfigurationManager.AppSettings[itemCodeKey];
                            if (string.IsNullOrEmpty(itemCodeKey) || string.IsNullOrEmpty(itemcode))
                            {
                                pass = true;
                            }
                            else
                            {
                                if (UserAuthentication.HttpSessionAlive)
                                {
                                    pass = UserAuthentication.IsAuthorizedItem(itemcode);
                                }
                            }
                            if (pass)
                            {
                                Menu m;
                                m.Id = id;
                                m.Text = menu.Attribute("text")?.Value;
                                m.Target = menu.Attribute("target")?.Value;
                                m.Seq = Convert.ToInt32(menu.Attribute("seq")?.Value ?? "-1");
                                m.FaIcon = menu.Attribute("faIcon")?.Value;
                                //prepare url
                                var url = menu.Attribute("url")?.Value;
                                if (url != null)
                                {
                                    url = url.Replace("{CurrentAuthenticationSessionId}", UserAuthentication.AuthenticationSessionId);
                                    url = url.Replace("{CurrentUserId}", UserAuthentication.UserId);
                                }
                                m.Url = url;
                                menus.Add(m);
                            }
                        }
                    }
                }
            }

            string returnTag = "";
            foreach (var m in menus.OrderBy(e => e.Seq))
            {
                string target = "";
                if (!string.IsNullOrEmpty(m.Target)) target = "target='" + m.Target + "'";

                returnTag += $"<li><a id='menu-item-{m.Id}' href='{(string.IsNullOrEmpty(m.Url) ? "javascript:;" : m.Url)}' target='{(string.IsNullOrEmpty(m.Target) ? "_self" : m.Target)}'><i class='menu-icon  {(string.IsNullOrEmpty(m.FaIcon) ? "fa-caret-right" : m.FaIcon)}'></i><span class='menu-text'> {m.Text} </span></a><b class='arrow'></b></li>";
            }
            return new MvcHtmlString(returnTag);
        }

        struct Menu
        {
            public string Id;
            public string Text;
            public string Url;
            public string Target;
            public int Seq;
            public string FaIcon;
        };

        /* luechai 2019-07-01 */
        public class TagItem
        {
            public string Id { get; set; }
            public string Text { get; set; }
            public string Url { get; set; }
            public string Icon { get; set; }
            public string ItemCodeKey { get; set; }
            public List<TagItem> SubMenu { get; set; }
            public string GroupMenu { get; set; }
            public string target { get; set; }
        }

        public static MvcHtmlString MainMenu()
        {
            var lang = Toptier.Web.Resource.ResourceManager.LanguageResource;
            var Url = new System.Web.Mvc.UrlHelper(HttpContext.Current.Request.RequestContext);
            var menus = new List<TagItem>();

            /* ::: example tamplate :::
             * menus.Add(new TagItem { GroupMenu = "", Id = "", Text = lang.GetValue(""), Url = Url.Action("index", "workorder"), ItemCodeKey = "", Icon = "" }); 
             */

            //===============================================================
            //::: Inventory :::
            //menus.Add(new TagItem { GroupMenu = "inventory", Id = "db-inv", Text = lang.GetValue("Dashboard"), Url = Url.Action("inventory", "dashboard"), ItemCodeKey = "auth-dashbord-inv", Icon = "fa-tachometer" });            

            menus.Add(new TagItem { GroupMenu = "", Id = "application-form", Text = "Application Form", Url = Url.Action("Index", "Home"), ItemCodeKey = "auth-application-form", Icon = "fa fa-home" });
            menus.Add(new TagItem { GroupMenu = "", Id = "application-report", Text = "Application Report", Url = Url.Action("Index", "Report"), ItemCodeKey = "auth-report", Icon = "fa fa-address-card" });
            //menus.Add(new TagItem { GroupMenu = "inventory", Id = "quiz-upload", Text = "Quiz Upload", Url = Url.Action("Upload", "Quiz"), ItemCodeKey = "auth-quiz-upload", Icon = "fa-cloud-upload" });
            menus.Add(new TagItem
            {
                GroupMenu = "",
                Id = "quiz",
                Text = "Quiz",
                Url = null,
                ItemCodeKey = null,
                Icon = "fa fa-pencil-square",
                SubMenu = new List<TagItem> {
                    new TagItem { GroupMenu= "", Id = "quiz-Recruitment", Text = "Recruitment Test", Url = Url.Action("QuizList", "Quiz", new { QuizType = "Recruitment" }), ItemCodeKey = "auth-test1" , Icon = "fa-file-alt" },
                    new TagItem { GroupMenu= "", Id = "quiz-In-Program", Text = "In-Program Test", Url = Url.Action("QuizList", "Quiz", new { QuizType = "In-Program" }), ItemCodeKey = "auth-test2" , Icon = "fa-file-alt" },
                    new TagItem { GroupMenu= "", Id = "quiz-Qualification", Text = "Qualification Test", Url = Url.Action("QuizList", "Quiz", new { QuizType = "Qualification" }), ItemCodeKey = "auth-test3" , Icon = "fa fa-file-text" },
                    new TagItem { GroupMenu= "", Id = "quiz-upload", Text = "Upload", Url = Url.Action("Upload", "Quiz"), ItemCodeKey = "auth-upload-quiz" , Icon = "fa fa-cloud-upload" },
                }
            });
            menus.Add(new TagItem { GroupMenu = "", Id = "quiz-report", Text = "Quiz Report", Url = Url.Action("Quiz", "Report"), ItemCodeKey = "auth-quiz-report", Icon = "fa fa-pie-chart" });
            menus.Add(new TagItem
            {
                GroupMenu = "",
                Id = "Evaluation",
                Text = "Evaluation",
                Url = null,
                ItemCodeKey = null,
                Icon = "fa fa-pencil-square-o",
                SubMenu = new List<TagItem> {
                    new TagItem { GroupMenu = "", Id = "Performance", Text = "Performance", Url = Url.Action("Index", "Performance"), ItemCodeKey = "auth-performance" , Icon = "fas fa fa-list" },
                    new TagItem { GroupMenu = "", Id = "Vocational", Text = "Vocational", Url = Url.Action("Index", "Vocational"), ItemCodeKey = "auth-vocational", Icon = "fas fa fa-list" },
                    new TagItem { GroupMenu = "", Id = "SkillMatrix", Text = "Skill Matrix", Url = Url.Action("Index", "SkillMatrix"), ItemCodeKey = "auth-skill-matrix", Icon = "fas fa fa-list" }
                }
            });
            menus.Add(new TagItem { GroupMenu = "", Id = "Message", Text = "Message", Url = Url.Action("MsgBoard", "MessageBox"), ItemCodeKey = "auth-msg", Icon = "fas fa fa-envelope" });
            menus.Add(new TagItem { GroupMenu = "", Id = "UserAccount", Text = "User Account", Url = Url.Action("Index", "UserAccount"), ItemCodeKey = "auth-admin", Icon = "fas fa fa-users" });
            menus.Add(new TagItem
            {
                GroupMenu = "",
                Id = "Setting",
                Text = "Setting",
                Url = null,
                ItemCodeKey = null,
                Icon = "fa fa-cogs",
                SubMenu = new List<TagItem> {
                    new TagItem { GroupMenu= "", Id = "Workstation", Text = "Work station", Url = Url.Action("WorkStationMain", "SkillMatrix"), ItemCodeKey = "auth-workstation" , Icon = "fas fa-toolbox" },
                 new TagItem { GroupMenu= "", Id = "Import", Text = "Import Recruitment Data", Url = Url.Action("Index", "Import"), ItemCodeKey = "auth-import" , Icon = "fas fa-toolbox" },
                 new TagItem { GroupMenu= "", Id = "Export", Text = "Export Recruitment Data", Url = Url.Action("Index", "Export"), ItemCodeKey = "auth-export" , Icon = "fas fa-toolbox" }
                }
            });

            //menus.Add(new TagItem
            //{
            //    GroupMenu = "inventory",
            //    Id = "report",
            //    Text = "Report",
            //    Url = null,
            //    ItemCodeKey = null,
            //    Icon = "fa-book",
            //    SubMenu = new List<TagItem> {
            //        new TagItem { GroupMenu= "", Id = "report-Quiz", Text = "Recruitment Report", Url = Url.Action("QuizReport", "Report"), ItemCodeKey = "auth-quiz-test" , Icon = "fa-file-alt" },
            //    }
            //});


            //var quiz = new TagItem
            //{
            //    GroupMenu = "quiz",
            //    Id = "quiz",
            //    Text = "Quiz",
            //    Url = null,
            //    ItemCodeKey = "auth-quiz-upload",
            //    Icon = "fa-laptop",
            //    SubMenu = new List<TagItem> {
            //        new TagItem { GroupMenu = "", Id = "quiz-upload", Text = "Quiz Upload", Url = Url.Action("Upload", "Quiz"), ItemCodeKey = "auth-quiz-upload", Icon = "fa-cloud-upload" }
            //    }
            //};
            //menus.Add(quiz);
            //var receipt = new TagItem { GroupMenu = "inventory", Id = "rec", Text = lang.GetValue("GoodsReceipt"), Url = Url.Action("index", "receipt"), ItemCodeKey = "auth-receipt", Icon = "fa-truck" };
            //menus.Add(GetCustomMenu("receipt", receipt));

            //var inspection = new TagItem { GroupMenu = "inventory", Id = "ins", Text = lang.GetValue("IncomingInspection"), Url = Url.Action("index", "inspection"), ItemCodeKey = "auth-inspection", Icon = "fa-search-minus" };
            //menus.Add(GetCustomMenu("inspection", inspection));

            //var container = new TagItem { GroupMenu = "inventory", Id = "tag", Text = lang.GetValue("Container"), Url = null, ItemCodeKey = null, Icon = "fa-barcode",
            //    SubMenu = new List<TagItem> {
            //        new TagItem{ GroupMenu= "", Id = "con", Text = lang.GetValue("Assign"), Url = Url.Action("index", "container"), ItemCodeKey = "auth-tag-assign" },
            //        new TagItem{ GroupMenu= "", Id = "spl", Text = lang.GetValue("Split"), Url = Url.Action("split", "container"), ItemCodeKey = "auth-tag-split" },
            //        new TagItem{ GroupMenu= "", Id = "sct", Text = lang.GetValue("SplitConvert"), Url = Url.Action("splitconvert", "container"), ItemCodeKey = "auth-tag-splitconvert" },
            //        new TagItem{ GroupMenu= "", Id = "trn", Text = lang.GetValue("Transfer"), Url = Url.Action("transfer", "container"), ItemCodeKey = "auth-tag-transfer" },                    
            //    }
            //};
            //menus.Add(GetCustomMenu("container", container));

            //var scanIn = new TagItem { GroupMenu = "inventory", Id = "inv-scan", Text = lang.GetValue("ScanIn"), Url = Url.Action("scanin", "inventory"), ItemCodeKey = "auth-scanIn", Icon = "fa-angle-double-down" };
            //menus.Add(GetCustomMenu("scanIn", scanIn));

            ////var order = new TagItem { GroupMenu = "inventory", Id = "od-pic" + Order.OrderReferenceType.None.ToString(), Text = lang.GetValue("PickingItem"), Url = Url.Action("index", "order", new { refType = Order.OrderReferenceType.None }), ItemCodeKey = "auth-pickingItem-inv", Icon = "fa-list-alt" };
            //var order = new TagItem { GroupMenu = "inventory", Id = "od-pik", Text = lang.GetValue("PickingItem"), Url = Url.Action("index", "order"), ItemCodeKey = "auth-pickingItem", Icon = "fa-list-alt" };
            //menus.Add(GetCustomMenu("order", order));

            //menus.Add(new TagItem { GroupMenu = "inventory", Id = "inv-sco", Text = lang.GetValue("ScanOut"), Url = Url.Action("scanout", "inventory"), ItemCodeKey = "auth-scanOut", Icon = "fa-angle-double-up" });

            //var pack = new TagItem { GroupMenu = "inventory", Id = "pac", Text = lang.GetValue("Packing"), Url = Url.Action("index", "pack"), ItemCodeKey = "auth-packing", Icon = "fa fa-archive" };
            //menus.Add(GetCustomMenu("pack", pack));

            //var delivery = new TagItem { GroupMenu = "inventory", Id = "dlv", Text = lang.GetValue("Delivery"), Url = null, ItemCodeKey = null, Icon = "fa-truck",
            //    SubMenu = new List<TagItem> {
            //        //new TagItem{ GroupMenu= "", Id = "od-pic-" + Order.OrderReferenceType.SalesOrder.ToString(), Text = lang.GetValue("PickingItem"), Url = Url.Action("index", "order", new { refType = Order.OrderReferenceType.SalesOrder }), ItemCodeKey = "auth-pickingItem-sale" },
            //        new TagItem{ GroupMenu= "", Id = "ship", Text = lang.GetValue("Shipping"), Url = Url.Action("index", "ship"), ItemCodeKey = "auth-shipping" },
            //        new TagItem{ GroupMenu= "", Id = "sdp", Text = lang.GetValue("TruckLoad"), Url = Url.Action("truckload", "ship"), ItemCodeKey = "auth-truckLoad", Icon = "fa-align-left" }
            //    }
            //};
            //menus.Add(GetCustomMenu("delivery", delivery));

            //menus.Add(new TagItem { GroupMenu = "inventory", Id = "man", Text = lang.GetValue("Manage"), Url = null, ItemCodeKey = null, Icon = "fa-wrench ",
            //    SubMenu = new List<TagItem> {
            //        new TagItem { GroupMenu= "", Id = "inv-li", Text = lang.GetValue("Inventory"), Url = Url.Action("index", "inventory"), ItemCodeKey = "auth-manage" },
            //        new TagItem { GroupMenu= "", Id = "inv-rv", Text = lang.GetValue("ReverseGR"), Url = Url.Action("reversegr", "inventory"), ItemCodeKey = "auth-reverseGR" },
            //    }
            //});

            //menus.Add(new TagItem { GroupMenu = "inventory", Id = "inv-cf", Text = lang.GetValue("InventoryCount"), Url = Url.Action("countProfile", "inventory"), ItemCodeKey = "auth-inv-countProfile", Icon = "fa-check-circle" });

            //var inventory = new TagItem { GroupMenu = "inventory", Id = "cinv", Text = lang.GetValue("Inventory"), Url = null, ItemCodeKey = "auth-NotCore", Icon = "fa fa-cubes" };
            //menus.Add(GetCustomMenu("inventory", inventory));

            //var invReport = new TagItem
            //{
            //    GroupMenu = "inventory", Id = "rpt", Text = lang.GetValue("Reports"), Url = null, ItemCodeKey = null, Icon = "fa-file-text",
            //    SubMenu = new List<TagItem> {
            //        new TagItem{ GroupMenu= "", Id = "rpt-ch", Text = lang.GetValue("ContainerHistory"), Url = Url.Action("containerhistory", "report", new { layoutPopup = false }), ItemCodeKey = "auth-rpt-tagHistory" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-ci", Text = lang.GetValue("CurrentInventory"), Url = Url.Action("currentinventory", "report"), ItemCodeKey = "auth-rpt-currentInventory" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-mr", Text = lang.GetValue("GoodsReceipt"), Url = Url.Action("materialreceipt", "report"), ItemCodeKey = "auth-rpt-goodsReceipt" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-gi", Text = lang.GetValue("GRItem"), Url = Url.Action("gritem", "report"), ItemCodeKey = "auth-rpt-grItem" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-mi", Text = lang.GetValue("PartIssue"), Url = Url.Action("materialissue", "report"), ItemCodeKey = "auth-rpt-picking" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-ph", Text = lang.GetValue("PackingHistory"), Url = Url.Action("packinghistory", "report"), ItemCodeKey = "auth-rpt-packingHistory" },                    
            //        new TagItem{ GroupMenu= "", Id = "rpt-sf", Text = lang.GetValue("SkippedFIFO"), Url = Url.Action("skippedfifo", "report"), ItemCodeKey = "auth-rpt-skippedFIFO" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-ls", Text = lang.GetValue("LocationStatus"), Url = Url.Action("locationstatus", "report"), ItemCodeKey = "auth-rpt-locationAvailability" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-al", Text = lang.GetValue("AvailabilityLocation"), Url = Url.Action("availabilitylocation", "report"), ItemCodeKey = "auth-rpt-partLocation" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-mm", Text = lang.GetValue("Movement"), Url = Url.Action("stockmovement", "report"), ItemCodeKey = "auth-rpt-movement" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-vs", Text = lang.GetValue("VerifyStockSummary"), Url = Url.Action("verifystocksummary", "report"), ItemCodeKey = "auth-rpt-verifyStockSummary" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-tl", Text = lang.GetValue("TruckLoad"), Url = Url.Action("truckload", "report"), ItemCodeKey = "auth-rpt-truckLoad" },                    
            //    }
            //};
            //menus.Add(GetCustomMenu("inventoryReport", invReport));

            ////===============================================================
            ////::: Production :::          
            ////menus.Add(new TagItem { GroupMenu = "production", Id = "db-pd", Text = lang.GetValue("Dashboard"), Url = Url.Action("production", "dashboard"), ItemCodeKey = "auth-dashbord-prod", Icon = "fa-tachometer" });
            //var wo = new TagItem { GroupMenu = "production", Id = "wo-wo", Text = lang.GetValue("WorkOrder"), Url = Url.Action("index", "workorder"), ItemCodeKey = "auth-workOrder", Icon = "fa-gavel", SubMenu = null };
            //menus.Add(GetCustomMenu("workorder", wo));

            //var qc = new TagItem { GroupMenu = "production", Id = "qc", Text = lang.GetValue("IncomingInspection"), Url = null, ItemCodeKey = "auth-NotCore", Icon = "fa-search-minus", SubMenu = null };
            //menus.Add(GetCustomMenu("qcInspection", qc));

            //var barcode = new TagItem { GroupMenu = "production", Id = "bp", Text = lang.GetValue("BarcodePrint"), Url = null, ItemCodeKey = "auth-NotCore", Icon = "fa-print", SubMenu = null };
            //menus.Add(GetCustomMenu("barcodePrint", barcode));

            ////menus.Add(new TagItem { GroupMenu = "production", Id = "od-pic-" + Order.OrderReferenceType.WorkOrder.ToString(), Text = lang.GetValue("PickingItem"), Url = Url.Action("index", "order", new { refType = Order.OrderReferenceType.WorkOrder }), ItemCodeKey = "auth-pickingItem-prod", Icon = "fa-list-alt" });

            //var prod = new TagItem { GroupMenu = "production", Id = "bp", Text = lang.GetValue("Production"), Url = null, ItemCodeKey = "auth-NotCore", Icon = "fa-cogs", SubMenu = null };
            //menus.Add(GetCustomMenu("production", prod));

            //var proReport = new TagItem { GroupMenu = "production", Id = "rpt", Text = lang.GetValue("Reports"), Url = null, ItemCodeKey = null, Icon = "fa-file-text",
            //    SubMenu = new List<TagItem> {
            //        new TagItem{ GroupMenu= "", Id = "rpt-wo", Text = lang.GetValue("WorkOrderHistory"), Url = Url.Action("workorderhistory", "report"), ItemCodeKey = "auth-rpt-workOrderHistory" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-ev", Text = lang.GetValue("EventLog"), Url = Url.Action("eventlog", "report"), ItemCodeKey = "auth-rpt-workOrderHistory" },
            //    }
            //};
            //menus.Add(GetCustomMenu("productionReport", proReport));

            ////===============================================================
            ////::: Sales & Distribution :::
            ////menus.Add(new TagItem { GroupMenu = "sales", Id = "db-so", Text = lang.GetValue("Dashboard"), Url = Url.Action("sales", "dashboard"), ItemCodeKey = "auth-dashbord-sale", Icon = "fa-tachometer" });
            //menus.Add(new TagItem { GroupMenu = "sales", Id = "po", Text = lang.GetValue("PurchaseOrder"), Url = Url.Action("index", "purchaseorder"), ItemCodeKey = "auth-purchaseorder", Icon = "fa-cart-plus" });

            //var so = new TagItem { GroupMenu = "sales", Id = "so", Text = lang.GetValue("SalesOrder"), Url = Url.Action("index", "salesorder"), ItemCodeKey = "auth-salesOrder", Icon = "fa-clipboard" };
            //menus.Add(GetCustomMenu("salesOrder", so));            

            //menus.Add(new TagItem { GroupMenu = "sales", Id = "inv", Text = lang.GetValue("Invoice"), Url = Url.Action("index", "Invoice"), ItemCodeKey = "auth-invoice", Icon = "fa fa-file-o" });

            //var sal = new TagItem { GroupMenu = "sales", Id = "sal", Text = lang.GetValue("SalesAndDistribution"), Url = null, ItemCodeKey = "auth-NotCore", Icon = "fa-shopping-cart", SubMenu = null };
            //menus.Add(GetCustomMenu("sales", sal));

            //var salReport = new TagItem { GroupMenu = "sales", Id = "rpt", Text = lang.GetValue("Reports"), Url = null, ItemCodeKey = null, Icon = "fa-file-text",
            //    SubMenu = new List<TagItem> {
            //        new TagItem{ GroupMenu= "", Id = "rpt-so", Text = lang.GetValue("SalesOrder"), Url = Url.Action("salesorder", "report"), ItemCodeKey = "auth-rpt-salesOrder" },
            //        new TagItem{ GroupMenu= "", Id = "rpt-id", Text = lang.GetValue("InvoiceDetails"), Url = Url.Action("invoicedetail", "report"), ItemCodeKey = "auth-rpt-invoiceDetail" },
            //    }
            //};
            //menus.Add(GetCustomMenu("salesReport", salReport));

            ////===============================================================
            ////::: Setting :::
            //menus.Add(new TagItem
            //{
            //    GroupMenu = "setting",
            //    Id = "md-gen",
            //    Text = lang.GetValue("MasterData"),
            //    Url = null,
            //    ItemCodeKey = null,
            //    Icon = "fa-database",
            //    SubMenu = new List<TagItem> {
            //                new TagItem { GroupMenu= "", Id = "md-pn", Text = lang.GetValue("Part"), Url = Url.Action("index", "part"), ItemCodeKey = "auth-part" },
            //                new TagItem { GroupMenu= "", Id = "md-bo", Text = lang.GetValue("BOM"), Url = Url.Action("index", "BOM"), ItemCodeKey = "auth-bom" },
            //                new TagItem { GroupMenu= "", Id = "mit", Text = lang.GetValue("Incoterm"), Url = Url.Action("index", "incoterm"), ItemCodeKey = "auth-incoterm"},
            //                new TagItem { GroupMenu= "", Id = "mpc", Text = lang.GetValue("mPartCategory"), Url = Url.Action("partcategory", "part"), ItemCodeKey = "auth-partCategory"},
            //                new TagItem { GroupMenu= "", Id = "mpt", Text = lang.GetValue("mPartType"), Url = Url.Action("parttype", "part"), ItemCodeKey = "auth-partType"},
            //                new TagItem { GroupMenu= "", Id = "mpg", Text = lang.GetValue("mPartGroup"), Url = Url.Action("partgroup", "part"), ItemCodeKey = "auth-partGroup"},
            //                new TagItem { GroupMenu= "", Id = "mrt", Text = lang.GetValue("ReceiptType"), Url = Url.Action("receipttype", "receipt"), ItemCodeKey = "auth-receiptType"},
            //                new TagItem { GroupMenu= "", Id = "mot", Text = lang.GetValue("PartIssueType"), Url = Url.Action("ordertype", "order"), ItemCodeKey = "auth-pickingType"},
            //                new TagItem { GroupMenu= "", Id = "mpl", Text = lang.GetValue("ProductionLine"), Url = Url.Action("index", "productionline"), ItemCodeKey = "auth-productionLine"},
            //                new TagItem { GroupMenu= "", Id = "md-cur", Text = lang.GetValue("Currency"), Url = Url.Action("index", "currency"), ItemCodeKey = "auth-currency"},
            //                new TagItem { GroupMenu= "", Id = "md-uom", Text = lang.GetValue("UOM"), Url = Url.Action("index", "uom"), ItemCodeKey = "auth-uom"},
            //                new TagItem { GroupMenu= "", Id = "md-wht", Text = lang.GetValue("WarehouseType"), Url = Url.Action("index", "warehousetype"), ItemCodeKey = "auth-warehouseType"},
            //                new TagItem { GroupMenu= "", Id = "md-mmt", Text = lang.GetValue("MovementType"), Url = Url.Action("index", "movementtype"), ItemCodeKey = "auth-movementType"},
            //                new TagItem { GroupMenu= "", Id = "md-pot", Text = lang.GetValue("POType"), Url = Url.Action("potype", "purchaseorder"), ItemCodeKey = "auth-poType"},
            //                new TagItem { GroupMenu= "", Id = "md-sot", Text = lang.GetValue("SOType"), Url = Url.Action("sotype", "salesorder"), ItemCodeKey = "auth-soType"},
            //                new TagItem { GroupMenu= "", Id = "md-ivt", Text = lang.GetValue("InvoiceType"), Url = Url.Action("invoicetype", "invoice"), ItemCodeKey = "auth-invoiceType"},
            //                new TagItem { GroupMenu= "", Id = "md-wot", Text = lang.GetValue("WOType"), Url = Url.Action("wotype", "workorder"), ItemCodeKey = "auth-woType"},
            //            }
            //});

            //menus.Add(new TagItem { GroupMenu = "setting", Id = "md-lb", Text = lang.GetValue("Label"), Url = Url.Action("index", "label"), ItemCodeKey = "auth-label", Icon = "fa-tag" });
            //menus.Add(new TagItem
            //{
            //    GroupMenu = "setting",
            //    Id = "md-st",
            //    Text = lang.GetValue("StorageLocations"),
            //    Url = null,
            //    ItemCodeKey = null,
            //    Icon = "fa-globe",
            //    SubMenu = new List<TagItem> {
            //                new TagItem { GroupMenu= "", Id = "md-st-wh", Text = lang.GetValue("Warehouse"), Url = Url.Action("index", "warehouse"), ItemCodeKey = "auth-warehouse" },
            //                new TagItem { GroupMenu= "", Id = "md-st-zn", Text = lang.GetValue("Zone"), Url = Url.Action("index", "zone"), ItemCodeKey = "auth-zone" },
            //                new TagItem { GroupMenu= "", Id = "md-st-rc", Text = lang.GetValue("Rack"), Url = Url.Action("index", "rack"), ItemCodeKey = "auth-rack" },
            //                new TagItem { GroupMenu= "", Id = "md-st-lo", Text = lang.GetValue("Location"), Url = Url.Action("index", "location"), ItemCodeKey = "auth-location" },
            //            }
            //});
            //menus.Add(new TagItem { GroupMenu = "setting", Id = "md-ct", Text = lang.GetValue("StorageType"), Url = Url.Action("index", "StorageType"), ItemCodeKey = "auth-storageType", Icon = "fa-dot-circle-o" });
            //menus.Add(new TagItem { GroupMenu = "setting", Id = "md-cf", Text = lang.GetValue("CustomFields"), Url = Url.Action("index", "customfield"), ItemCodeKey = "auth-customField", Icon = "fa-expand" });

            //menus.Add(new TagItem { GroupMenu = "setting", Id = "em", Text = lang.GetValue("Email"), Url = null, ItemCodeKey = null, Icon = "fa-envelope ",
            //    SubMenu = new List<TagItem> {
            //        new TagItem { GroupMenu= "", Id = "em-st", Text = lang.GetValue("SMTPServer"), Url = Url.Action("emailsetting", "email"), ItemCodeKey = "auth-email" },
            //        new TagItem { GroupMenu= "", Id = "em-fu", Text = lang.GetValue("Settings"), Url = Url.Action("index", "email"), ItemCodeKey = "auth-email" },
            //    }
            //});

            //menus.Add(new TagItem { GroupMenu = "setting", Id = "md-aut", Text = lang.GetValue("UserAccount"), Url = Url.Action("index", "authorization"), ItemCodeKey = "auth-userAccount", Icon = "fa-users" });
            //menus.Add(new TagItem
            //{
            //    GroupMenu = "setting",
            //    Id = "md-dev",
            //    Text = lang.GetValue("Developer"),
            //    Url = null,
            //    ItemCodeKey = null,
            //    Icon = "fa-code",
            //    SubMenu = new List<TagItem> {
            //                new TagItem{ GroupMenu= "", Id = "dv-enum", Text = "Enum Info", Url = Url.Action("enuminfo", "home"), ItemCodeKey = "auth-enumInfo" },
            //                new TagItem{ GroupMenu= "", Id = "dv-dev", Text = "Developer", Url = Url.Action("developer", "home"), ItemCodeKey = "auth-enumInfo" },
            //                new TagItem{ GroupMenu= "", Id = "dv-api", Text = "API", Url = Url.Action("inventory", "dashboard"), ItemCodeKey = "auth-api" },
            //            }
            //});

            string tag = "";
            foreach (var m in menus)
            {
                if (m.SubMenu == null)
                {
                    tag += GetTagString(m, false);
                }
                else
                {
                    //tag += string.Format("<li class='group-menu-{0} hide hsub'>"//ถ้าไม่มีGroupMenuของเดิมจะซ่อน 
                    tag += string.Format("<li class='group-menu-{0} '>"//แบบใหม่จะไม่ซ่อน
                                       + "<a href='#' class='dropdown-toggle'>"
                                        + "<i class='menu-icon  {1}'></i><span class='menu-text'> {2} </span><b class='arrow fa fa-angle-down'></b>"
                                        + "</a><b class='arrow'></b>"
                                        + "<ul class='submenu'>", m.GroupMenu, m.Icon, m.Text);

                    foreach (var s in m.SubMenu)
                    {
                        if (s.SubMenu == null)
                        {
                            tag += GetTagString(s, true);
                        }
                        else
                        {
                            tag += string.Format("<li class='hsub'>"
                                        + "<a href='#' class='dropdown-toggle'>"
                                        + "<i class='menu-icon fa fa-caret-right'></i><span class='menu-text'> {0} </span><b class='arrow fa fa-angle-down'></b>"
                                        + "</a><b class='arrow'></b>"
                                        + "<ul class='submenu'>", s.Text);
                            foreach (var i in s.SubMenu)
                            {
                                tag += GetTagString(i, true);
                            }
                            tag += "</ul>"
                                + "</li>";
                        }
                    }

                    tag += "</ul>"
                        + "</li>";
                }
            }

            return new MvcHtmlString(tag);
        }

        public static string GetTagString(TagItem obj, bool isSub)
        {
            bool pass = false;

            //Get itemcode
            string itemcode = System.Configuration.ConfigurationManager.AppSettings[obj.ItemCodeKey];
            if (string.IsNullOrEmpty(obj.ItemCodeKey))
            {
                pass = true;
            }
            else if (string.IsNullOrEmpty(obj.ItemCodeKey) || string.IsNullOrEmpty(itemcode))
            {
                pass = false; // true;                
            }
            else
            {
                if (UserAuthentication.HttpSessionAlive)
                    pass = UserAuthentication.IsAuthorizedItem(itemcode);
            }

            string tag = "";
            if (pass)
            {
                //tag = string.Format("<li class='{0} hide'>"
                tag = string.Format("<li class='{0} '>"//แบบใหม่จะไม่ซ่อน
                       + "<a id='menu-item-{1}' href='{2}' target='{3}'>"
                        + "<i class='menu-icon {4}'></i>"
                        + "<span class='menu-text'> {5} </span>"
                        + "</a> <b class='arrow'></b>"
                        + "</li>", (isSub ? "sub" : "group-menu-" + obj.GroupMenu), obj.Id, obj.Url, obj.target
                        , (isSub ? "fa-caret-right" : obj.Icon), obj.Text);
            }
            return tag;
        }

        public static TagItem GetCustomMenu(string mainMenu, TagItem obj)
        {
            XmlDocument doc = new XmlDocument();
            doc.Load(System.Web.HttpContext.Current.Server.MapPath("~/Custom.xml"));

            var Url = new UrlHelper(HttpContext.Current.Request.RequestContext);
            var ssid = UserAuthentication.AuthenticationSessionId;
            var subs = new List<TagItem>();

            var MainSub = obj.SubMenu;

            /* เอาตัว Main menu มาเป็น sub */
            subs.Add(new TagItem { Id = obj.Id, Text = obj.Text, Url = obj.Url, ItemCodeKey = obj.ItemCodeKey, target = obj.target });

            //Loop through the selected Nodes.
            foreach (XmlNode node in doc.SelectNodes("/CATALOG/CustomMenus/" + mainMenu))
            {
                //Fetch the Node values and assign it to Model.        
                string id = node["Id"].InnerText;
                string url = node["Url"].InnerText + "?ssid=" + ssid;
                string target = node["Target"].InnerText;
                if (target == "")
                    url = Url.Action(mainMenu, "inventorycustom", new { menuId = id, url });

                var m = new TagItem
                {
                    Id = id,
                    Text = node["Text"].InnerText,
                    Url = url,
                    ItemCodeKey = "auth-cust-" + mainMenu,
                    target = target,
                };
                subs.Add(m);
            }

            if (subs.Count() > 1)
            {
                if (MainSub == null)
                    obj.SubMenu = subs;
                else
                    obj.SubMenu = MainSub.Concat(subs).ToList();
            }

            return obj;
        }
    }

    #region RedirectPage

    public class RedirectPage
    {
        public class RedirectPageModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Url { get; set; }
        }

        public static List<RedirectPageModel> GetRedirectPageAll()
        {
            List<RedirectPageModel> pages = new List<RedirectPageModel>();

            XmlDocument doc = new XmlDocument();
            doc.Load(System.Web.HttpContext.Current.Server.MapPath("~/Custom.xml"));

            //Loop through the selected Nodes.
            foreach (XmlNode node in doc.SelectNodes("/CATALOG/RedirectPages/page"))
            {
                //Fetch the Node values and assign it to Model.
                pages.Add(new RedirectPageModel
                {
                    Id = int.Parse(node["Id"].InnerText),
                    Name = node["Name"].InnerText,
                    Url = node["Url"].InnerText
                });
            }

            return pages;
        }

        public static string GetRedirectPage()
        {
            string link;
            var Url = new System.Web.Mvc.UrlHelper(HttpContext.Current.Request.RequestContext);
            link = Url.Action("index", "ApplicationForm");

            string userId = UserAuthentication.UserId;
            string pageId = ManagerService.GetUser(userId).RedirectPage;

            if (!string.IsNullOrEmpty(pageId))
            {
                int n;
                if (int.TryParse(pageId, out n))
                {
                    var page = GetRedirectPageAll().Where(e => e.Id == Convert.ToInt32(pageId)).FirstOrDefault();
                    if (page != null)
                    {
                        link = page.Url;

                        /*Check web custom*/
                        if (link.Contains("ssid"))
                            link += UserAuthentication.AuthenticationSessionId;
                    }
                }
            }

            return link;
        }
    }

    #endregion End of RedirectPage
}