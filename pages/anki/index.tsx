import {useEffect, useState} from "react";
import {Custom} from "../custom/[id].tsx";

export default function Component() {
  const [query, setQuery] = useState("");

  useEffect(async () => {
    const timer = setInterval(async () => {
      console.log("polling");
      let res: Response;
      let data: any;
      try {
        let url = "http://localhost:8765";
        //        url = "http://office:8765";

        res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            "action": "guiCurrentCard",
            "version": 6,
          })
        })
      } catch (e) {
        // http error
        alert(e);
      }
      try {
        data = await res.json();
      } catch (e) {
        // json error
      }

      if (data.error) {
        // ankiconnect error
      }

      // data
      console.log(data.result.fields);
      const accessKey = ["Front", "Expression", "Word"];
      for (let k of accessKey) {
        console.log("testing front");
        if (data.result.fields[k]?.value) {
          setQuery(data.result.fields[k].value);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, []);


  return <Custom query={query} />;
}
