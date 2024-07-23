import React, { useState } from "react";
import Form from "./Form";

function Forms({ db }) {
  const [forms, setForms] = useState([1]);

  const addForm = function () {
    setForms((forms) => [...forms, 1]);
  };

  const removeForm = function () {
    setForms((forms) => forms.filter((_, i, arr) => i !== arr.length - 1));
  };

  return (
    <div className="forms">
      {forms.map((_) => (
        <Form
          db={db}
          forms={forms}
          addForm={addForm}
          removeForm={removeForm}
          key={crypto.randomUUID()}
        />
      ))}
    </div>
  );
}

export default Forms;
