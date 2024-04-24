import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
export default function PlainTextNode({ data }) {
  const [text, setText] = useState(data.value);
  const InputRef = useRef(null);

  const handleChangeText = () => {
    data.value = InputRef.current.value;
    setText(InputRef.current.value);
  };

  function adjustHeight() {
    const element = InputRef.current;
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;

      element.style.width = "auto";
      element.style.width = `${element.scrollWidth}px`;
    }
  }

  return (
    <>
      <div
        className={`${
          InputRef?.current?.value.trim() === "Enter Text" ? "border" : ""
        } max-h-[80rem] p-1`}
      >
        <Label htmlFor="text">
          <input
            ref={InputRef}
            id="text"
            name="text"
            value={text}
            onChange={handleChangeText}
            onInput={adjustHeight}
            className={`border-none outline-none w-36 focus-visible:ring-0 font-normal bg-transparent overflow-auto text-center text-xs resize-none`}
          />
        </Label>
      </div>
    </>
  );
}
