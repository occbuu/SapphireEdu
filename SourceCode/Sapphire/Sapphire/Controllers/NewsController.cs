using System.Web.Mvc;

namespace Sapphire.Controllers
{
    public class NewsController : Controller
    {
        // GET: News
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Details()
        {
            return View();
        }
    }
}