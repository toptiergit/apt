using System.Web;
using System.Web.Optimization;

namespace ApplicationForm
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/dataTable/js").Include(
                        "~/js/jquery.dataTables.min.js",
                        "~/js/jquery.dataTables.bootstrap.js",
                        "~/Content/dataTables.buttons/dataTables.buttons.min.js",
                        "~/Content/dataTables.responsive/dataTables.responsive.min.js",
                         "~/Content/dataTables.rowGroup/dataTables.rowGroup.min.js"
                        ));

            bundles.Add(new StyleBundle("~/bundles/dataTable/css").Include(
                      "~/Content/dataTables.responsive/responsive.dataTables.min.css",
                      "~/Content/dataTables.rowGroup/rowGroup.dataTables.min.css"
                      ));

            // ------------------------------------------------------------------------------
            bundles.Add(new ScriptBundle("~/bundles/dataTableFileExport/js").Include(
                        "~/Content/dataTables.fileExport/buttons.flash.min.js",
                        "~/Content/dataTables.fileExport/jszip.min.js",
                        "~/Content/dataTables.fileExport/pdfmake.min.js",
                        "~/Content/dataTables.fileExport/vfs_fonts.js",
                        "~/Content/dataTables.fileExport/buttons.html5.min.js",
                        "~/Content/dataTables.fileExport/buttons.print.min.js"
                        ));
            bundles.Add(new StyleBundle("~/bundles/dataTableFileExport/css").Include(
                        "~/Content/dataTables.fileExport/buttons.dataTables.min.css"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}
