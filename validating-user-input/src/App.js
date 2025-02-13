import { useState, useEffect } from "react";
import * as yup from "yup";
import "./App.css";

const validationErrors = {
  passwordPatternWrong:
    "Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number, & 1 special character.",
  termsIncorrect: "Terms must be accepted",
};

const formSchema = yup.object().shape({
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      validationErrors.passwordPatternWrong
    ),
  accept: yup.boolean().oneOf([true], validationErrors.termsIncorrect),
});

function App() {
  const [values, setValues] = useState({ password: "", accept: false });
  const [errors, setErrors] = useState({ password: "", accept: "" });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    formSchema.isValid(values).then((isValid) => {
      setEnabled(isValid);
    });
  }, [values]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log("Sending data to server...", values);
  };

  const handleChange = (evt) => {
    let { type, checked, name, value } = evt.target;
    if (type === "checkbox") value = checked;
    setValues({ ...values, [name]: value });

    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: "" });
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] });
      });
  };

  return (
    <div>
      <h2>Validating User Inputs</h2>
      <form onSubmit={handleSubmit}>
        {errors.password && <span>{errors.password}</span>}
        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Type Password"
            onChange={handleChange}
            value={values.password}
          />
        </label>

        {errors.accept && <span>{errors.accept}</span>}
        <label>
          Accept Terms
          <input
            checked={values.accept}
            onChange={handleChange}
            name="accept"
            type="checkbox"
          />
        </label>
        <input disabled={!enabled} type="submit" />
      </form>
    </div>
  );
}

export default App;
