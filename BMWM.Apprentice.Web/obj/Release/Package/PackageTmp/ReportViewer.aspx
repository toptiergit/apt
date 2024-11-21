<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportViewer.aspx.cs" Inherits="Toptier.Web.Mvc.ReportViewer" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=15.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title></title>
    <script src="<%=ResolveUrl("~/js/jquery.min.js")%>"></script>
</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="scm" runat="server"></asp:ScriptManager>
        <asp:HiddenField ID="hidReportSessionId" runat="server" />
        <asp:Panel ID="pnlTimeout" runat="server" Visible="false">
            <div style="font-size:large;text-align:center;padding-top:15px;">
                <div style="margin-bottom:5px;">
                    Session timeout. Please close this page and try again.
                </div>
                <div>
                    <button type="button" onclick="location.assign('<%=ResolveUrl("~/closepage.html")%>');" style="width:50px;">OK</button>
                </div>
            </div>
        </asp:Panel>
        <rsweb:ReportViewer ID="rpv" ShowRefreshButton="false" ShowBackButton="false" runat="server"></rsweb:ReportViewer>
    </form>
</body>
</html>
