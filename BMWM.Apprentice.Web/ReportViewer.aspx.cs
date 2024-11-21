using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

namespace Toptier.Web.Mvc
{
    //query string definition
    //-rptsid(require): Session id that keep object model Toptier.Common2.Models.ReportingServicesMvcReportViewer

    public partial class ReportViewer : System.Web.UI.Page
    {
        protected void Page_Init(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                hidReportSessionId.Value = Request.QueryString["rptsid"];
                var model = (Toptier.Reporting.ReportViewerData)Session[hidReportSessionId.Value];
                if (model != null)
                {
                    this.Title = "Report - " + model.ReportName;
                    rpv.ShowPrintButton = model.ShowPrintButton;
                    rpv.HyperlinkTarget = model.HyperlinkTarget;
                    rpv.SizeToReportContent = true;
                    rpv.ProcessingMode = ProcessingMode.Local;
                    LocalReport localReport = rpv.LocalReport;
                    localReport.EnableHyperlinks = model.LocalReportEnableHyperlinks;
                    localReport.ReportPath = model.ReportPath;
                    rpv.LocalReport.EnableExternalImages = true;
                    Dictionary<string, string> rptParameters = model.Parameters;
                    Dictionary<string, object> rptDataSources = model.DataSources;

                    foreach (var pair in rptDataSources)
                    {
                        ReportDataSource datasource = new ReportDataSource(pair.Key, pair.Value);
                        localReport.DataSources.Add(datasource);
                    }

                    if (rptParameters.Count > 0)
                    {
                        var ps = new List<Microsoft.Reporting.WebForms.ReportParameter>();
                        foreach (KeyValuePair<string, string> p in rptParameters)
                            ps.Add(new Microsoft.Reporting.WebForms.ReportParameter(p.Key, p.Value));
                        localReport.SetParameters(ps);
                    }

                    //this.rpv.LocalReport.SubreportProcessing += new SubreportProcessingEventHandler(LocalReport_SubreportProcessing);

                    //check if need render to file
                    if (model.RenderFileType != Toptier.Reporting.ReportViewerData.FileType.None)
                    {
                        if (string.IsNullOrEmpty(model.RenderFileName))
                            model.RenderFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + model.RenderFileType.GetData(1);

                        //export to file
                        Warning[] warnings;
                        string[] streamids;
                        string mimeType;
                        string encoding;
                        string filenameExtension;
                        rpv.LocalReport.EnableExternalImages = true;
                        byte[] bytes = rpv.LocalReport.Render(model.RenderFileType.GetData(0), null, out mimeType, out encoding, out filenameExtension, out streamids, out warnings);

                        //clean session
                        Session[hidReportSessionId.Value] = null;

                        Response.Clear();
                        Response.ContentType = mimeType;
                        Response.AddHeader("Content-Disposition", "attachment;filename=\"" + model.RenderFileName + "\"");
                        Response.BinaryWrite(bytes);
                        Response.Flush();
                        Response.End();
                    }
                }
                else
                {
                    pnlTimeout.Visible = true;
                }
            }
        }

        //void LocalReport_SubreportProcessing(object sender, Microsoft.Reporting.WebForms.SubreportProcessingEventArgs e)
        //{
        //    // get empID from the parameters
        //    int mainId = Convert.ToInt32(e.Parameters[0].Values[0]);

        //    // remove all previously attached Datasources, since we want to attach a
        //    // new one
        //    e.DataSources.Clear();

        //    // Retrieve employeeFamily list based on EmpID            
        //    var ds = Toptier.WMS.Reports.Services.ReportService.GetUsageConfirmDetailReport(mainId);

        //    // add retrieved dataset or you can call it list to data source
        //    e.DataSources.Add(new Microsoft.Reporting.WebForms.ReportDataSource()
        //    {
        //        Name = "DataSet1",
        //        Value = ds
        //    });

        //}
    }
}