import { useEffect, useState } from "react"

function Home() {

    const [value, setValue] = useState("");
    const [shortId, setShortId] = useState("");
    const [copied, setCopied] = useState(false);
    const [analytics, setAnalytics] = useState(null);


    const postData = async () => {
    try {
      const res = await fetch("http://localhost:8001/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });

      const data = await res.json();
      setShortId(data.id); 
    } catch (error) {
      console.error("Error:", error);
    }
    };

    
  const getData = async () => {
    if (!shortId) return;
    try {
      const res = await fetch(`http://localhost:8001/url/analytics/${shortId}`);
      const data = await res.json();
      console.log("Analytics:", data);
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    if (!shortId) return;

    const interval = setInterval(() => {
      getData();
    }, 2000);

    return () => clearInterval(interval);
  }, [shortId]);



    const handleCopy = () => {
    if (!shortId) return;
    const shortUrl = `http://localhost:8001/${shortId}`;
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("Copy failed", err));
    };


  return (
    <div className='w-[100dvw] h-[100dvh] flex flex-col justify-center items-center gap-5 overflow-x-hidden bg-gray-400'>

      <div className='w-full sm:w-150 h-full p-2 flex flex-col justify-start items-center'>
        <div className='w-full h-full px-4 rounded-2xl shadow-2xl flex flex-col justify-start items-center gap-5 bg-gray-300 overflow-hidden'>
            <h1 className='text-2xl font-semibold pt-2'>URL Shortner</h1>
            <input value={value} onChange={(e)=>setValue(e.target.value)} className='shadow-lg border-2 border-gray-400 w-full rounded-xl px-4 py-2 outline-0 decoration-0' placeholder='https://www.shorturl.com'/>
            <button onClick={postData} className='w-full h-auto shadow-2xl rounded-xl py-2 text-white  text-2xl cursor-pointer bg-gradient-to-r from-fuchsia-600 hover:from-fuchsia-800 to-indigo-500 hover:to-indigo-700 transition-colors duration-500 ease-in-out '>Shorten it</button>
            <div className='shadow-2xl bg-gray-400 gap-5 rounded-xl py-2 px-4 w-full h-auto flex flex-col justify-start items-center'>
                {shortId ? <div className='text-xl'>http://localhost:8001/{shortId}</div> : <div>No url shorten!</div>}
                {shortId && <button onClick={handleCopy} className="cursor-pointer pb-2 text-gray-200">{copied ? "Copied!" : "Click to copy"}</button>}
            </div>

            <div className="w-full h-full border-2 border-gray-400 px-2 rounded-2xl shadow-2xl mb-2 flex flex-col justify-start items-center ">
                <div className="w-full h-auto text-2xl font-semibold text-center">Analytics</div>
                <div className="w-full h-auto flex flex-col justify-start items-start gap-4">      
                    <div className="w-full flex text-center justify-center items-center text-xl">Total clicks: {analytics?.totalClicks || 0}</div>
                        <div className="flex flex-col gap-1 h-85 sm:h-100 w-full overflow-auto scrollbar-hide">
                            {/*  */}
                            <div className="text-sm border-b-2 pb-2 w-full text-gray-700 flex justify-between items-start">
                                <div className="flex gap-2 flex-col justify-start  items-center">
                                        <div className="text-md w-full text-center">Timestamps</div>
                                </div>
                                <div className="flex gap-2 flex-col justify-start  items-center">
                                        <div className="text-md w-full text-center">Operating system</div>
                                </div>
                                <div className="flex gap-2 flex-col justify-start  items-center">
                                        <div className="text-md w-full text-center">IpAddress</div>
                                </div>
                            </div>
                            {analytics?.analytics?.length > 0 ? (
                            analytics.analytics.map((entry, idx) => (
                                <div key={idx} className="text-sm w-full text-gray-700 flex justify-between items-start">
                                    <div className="flex gap-2 flex-col justify-start  items-center ">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </div>
                                    <div className="px-1 flex gap-2 flex-col justify-start break-before-column items-center ">
                                        {entry.device}
                                    </div>
                                    <div className={`${entry.ipAddress ? 'w-auto':'w-20'}  flex gap-2 flex-col justify-start break-all items-center `}>
                                        {entry.ipAddress}
                                        
                                    </div>
                                </div>
                            ))
                            ) : (
                            <div>No visits yet</div>
                            )}
                        </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}

export default Home
