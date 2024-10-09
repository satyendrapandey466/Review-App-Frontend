import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import Submit from "../form/Submit";
import Title from "../form/Title";

//Length of OTP
const OTP_LENGTH = 6;
let currentOTPIndex; //Index of OTP array to make that form input active

//Helper function to check that OTP provided is valid or not
const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    valid = !isNaN(parseInt(val)); //Checks whether the given otp array character is integer or not
    if (!valid) break;
  }

  return valid;
};

//Component handles the email verification i.e. OTP part
export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill("")); //Otp state
  const [activeOtpIndex, setActiveOtpIndex] = useState(0); //Current OTP index which is active
  const { updateNotification } = useNotification();

  //Getting data and methods provided by Auth context api
  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified = profile?.isVerified;

  const inputRef = useRef(); //Reference to the input form

  const location = useLocation();
  const user = location?.state?.user;
  const navigate = useNavigate();

  //Helper function to increment the opt index and set next form active
  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  //Helper function to decrement the opt index and set prev form input active
  const focusPrevInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0; //If index is zero don't go out of bound
    setActiveOtpIndex(nextIndex);
  };

  // Helper function to handle the change in OTP form field
  const handleOtpChange = ({ target }) => {
    const { value } = target;
    const newOtp = [...otp];
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length); //substring is taken to put only 1 last character

    if (!value) focusPrevInputField(currentOTPIndex);
    //if no input field is present then move to the prev field
    else focusNextInputField(currentOTPIndex);
    setOtp([...newOtp]); //update otp
  };

  //This helper function helps to manage the key support like arrow keys to move among otp fields or backspace on empty input field
  const handleKeyDown = ({ key }, index) => {
    currentOTPIndex = index;
    if (key === "Backspace") {
      focusPrevInputField(currentOTPIndex);
    }
    if (key === "ArrowRight") {
      focusNextInputField(currentOTPIndex);
    }
    if (key === "ArrowLeft") {
      focusPrevInputField(currentOTPIndex);
    }
    // console.log(key);
  };

  //Helper function which will handle OTP resend button click
  const handleOTPResend = async () => {
    const { error, message } = await resendEmailVerificationToken(user.id); //Requesting the api for new otp with post data of current user-id

    //Managing notification accordingly
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
  };

  //Helper function manages tasks after clicking submit button
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validates OTP
    if (!isValidOTP(otp)) {
      return updateNotification("error", "invalid OTP");
    }

    //Sending the api with userId and otp for verification
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(""), //changing the array of characters to string
      userId: user.id,
    });
    //Updating the notification according to response
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    //Storing the token provided by api after user creation is stored in local storage
    localStorage.setItem("auth-token", userResponse.token);
    isAuth(); //to trigger the authentication verification function which will update the userauth state and log in the user
  };

  //Renders every time the activeOTPindex changes to focus that index input field
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  //If user id is not provided with navigate redirects to not found page
  useEffect(() => {
    if (!user) navigate("/not-found");
    if (isLoggedIn && isVerified) navigate("/");
  }, [user, navigate, isLoggedIn, isVerified]);

  // if(!user) return null

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please enter the OTP to verify your account</Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex === index ? inputRef : null} //create reference to the current input field
                  key={index}
                  type="number"
                  value={otp[index] || ""}
                  onChange={handleOtpChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 dark:border-dark-subtle  border-light-subtle darK:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none"
                />
              );
            })}
          </div>
          <div>
            {/* This div is for rendering the request new otp or submit button */}
            <Submit value="Verify Account" />
            <button
              onClick={handleOTPResend}
              type="button"
              className="dark:text-white text-blue-500 font-semibold hover:underline mt-2"
            >
              I don't have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
