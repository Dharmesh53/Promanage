import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function PlainTextUpdaterNode({ data }) {
  const InputRef = useRef(null);
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  function adjustHeight() {
    const element = InputRef.current;
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;

      element.style.width = "auto";
      element.style.width = `${element.scrollWidth}px`;
      setSquareHeight(element.scrollHeight);
    }
  }

  return (
    <>
      <div className={`border max-h-[80rem] p-1`}>
        <Label htmlFor="text">
          <Input
            ref={InputRef}
            id="text"
            name="text"
            onInput={adjustHeight}
            onChange={onChange}
            className="border-none outline-none w-36 focus-visible:ring-0 p-2 font-normal bg-transparent overflow-auto text-center text-xs resize-none"
          />
        </Label>
      </div>
    </>
  );
}
