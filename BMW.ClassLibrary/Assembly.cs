using System.Diagnostics;

namespace BMW.ClassLibrary
{
    public static class Assembly
    {
        public static string FileVersion
        {
            get
            {
                System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
                FileVersionInfo fvi = FileVersionInfo.GetVersionInfo(assembly.Location);
                string version = fvi.FileVersion;
                return version;
            }
        }
    }
}
