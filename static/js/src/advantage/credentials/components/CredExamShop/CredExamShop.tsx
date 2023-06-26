import React, { useState } from "react";
import {
  Button,
  Col,
  RadioInput,
  Row,
  Strip,
} from "@canonical/react-components";
import classNames from "classnames";
import { currencyFormatter } from "advantage/react/utils";

const CredExamShop = () => {
  const ExamProducts = [
    {
      id: "cue-linux-essentials",
      longId: "lAK5jL8zvMjZOwaysIMQyGRAdOLgTQQH0xpezu2oYp74",
      name: "CUE Linux Essentials",
      period: "none",
      price: {
        currency: "USD",
        value: 4900,
      },
      productID: "cue-linux-essentials",
      status: "active",
      private: false,
      marketplace: "canonical-cube",
      metadata: [
        {
          key: "description",
          value:
            "Prove your basic operational knowledge of Linux by demonstrating your ability to secure, operate and maintain basic system resources. Topics include user and group management, file and filesystem navigation, and logs and installation tasks related to system maintenance.",
        },
      ],
    },
    {
      id: "cue-02-desktop",
      longId: "lAMGrt4buzUR0-faJqg-Ot6dgNLn7ubIpWiyDgOrsDCg",
      name: "CUE.02 Desktop QuickCert",
      price: { value: 4900, currency: "USD" },
      productID: "cue-02-desktop",
      canBeTrialled: false,
      private: true,
      marketplace: "canonical-cube",
      metadata: [
        {
          key: "description",
          value:
            "Demonstrate your knowledge of Ubuntu Desktop administrative essentials. Topics include package management, system installation, data gathering, and managing printing and displays.",
        },
      ],
    },
    {
      id: "cue-03-server",
      longId: "lAMGrt4buzUR0-faJqg-Ot6dgNLn7ubIpWiyDgOrsDCg",
      name: "CUE.03 Server QuickCert",
      price: { value: 4900, currency: "USD" },
      productID: "cue-03-server",
      canBeTrialled: false,
      private: true,
      marketplace: "canonical-cube",
      metadata: [
        {
          key: "description",
          value:
            "Illustrate your knowledge of common Ubuntu Server administrative tasks and troubleshooting. Topics include job control, performance tuning, services management, and Bash scripting.",
        },
      ],
    },
  ];
  const [exam, setExam] = useState(0);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExam(parseInt(event.target.value));
    localStorage.setItem("exam-selector", JSON.stringify(event?.target.value));
  };
  const handleSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    localStorage.setItem(
      "shop-checkout-data",
      JSON.stringify({
        product: ExamProducts[exam],
        quantity: 1,
        action: "purchase",
      })
    );
    location.href = "/account/checkout";
  };
  return (
    <>
      <Strip className="product-selector">
        <Row>
          <h2>Select an exam to purchase</h2>
        </Row>
        <Row className="u-hide--small">
          {ExamProducts.map((examElement, examIndex) => {
            return (
              <Col size={4} key={examIndex}>
                <div
                  className={classNames({
                    "p-card--radio--column": true,
                    "is-selected": exam == examIndex,
                  })}
                >
                  <label className="p-radio">
                    <input
                      className="p-radio__input"
                      autoComplete="off"
                      type="radio"
                      aria-labelledby={examElement.id + "-label"}
                      value={examIndex}
                      checked={exam == examIndex}
                      onChange={handleChange}
                      disabled={examElement.private}
                    />
                    <span className="p-radio__label">
                      <RadioInput
                        labelClassName="inner-label"
                        label={examElement.name}
                        checked={exam == examIndex}
                        value={examIndex}
                        onChange={handleChange}
                        disabled={examElement.private}
                      />
                      <hr />
                      <p style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                        {examElement.metadata[0].value}
                      </p>
                      <hr />
                      <h5
                        className="u-align--right"
                        style={{ paddingRight: "1rem" }}
                      >
                        {examElement.private
                          ? "Coming Soon!"
                          : "Price: " +
                            currencyFormatter.format(
                              examElement.price.value / 100
                            )}
                      </h5>
                    </span>
                  </label>
                </div>
              </Col>
            );
          })}
        </Row>
        {ExamProducts.map((examElement, examIndex) => {
          return (
            <Col className="u-hide u-show--small" size={12} key={examIndex}>
              <div
                className={classNames({
                  "p-card--radio--column": true,
                  "is-selected": exam == examIndex,
                })}
                onChange={handleChange}
                onClick={() => {
                  setExam(examIndex);
                }}
              >
                <RadioInput
                  inline
                  label={examElement.name}
                  checked={exam == examIndex}
                  value={examIndex}
                  onChange={handleChange}
                  disabled={examElement.private}
                />
                <span>
                  <p style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                    {examElement.metadata[0].value}
                  </p>
                </span>
                <span>
                  <h5
                    className="u-align--right"
                    style={{ paddingRight: "1rem" }}
                  >
                    {examElement.private
                      ? "Coming Soon!"
                      : "Price: " +
                        currencyFormatter.format(examElement.price.value / 100)}
                  </h5>
                </span>
              </div>
            </Col>
          );
        })}
      </Strip>
      <section className="p-strip--light is-shallow p-shop-cart p-shop-cart--cue">
        <Row className="u-sv3">
          <Col size={6} className="p-text--small-caps">
            Your Order
          </Col>
        </Row>
        <Row>
          <Col size={6} style={{ display: "flex" }}>
            <p className="p-heading--2" style={{ marginBlock: "auto" }}>
              {ExamProducts[exam].name}
            </p>
          </Col>
          <Col size={3} small={2} style={{ display: "flex" }}>
            <p className="p-heading--2" style={{ marginBlock: "auto" }}>
              {currencyFormatter.format(
                (ExamProducts[exam]?.price.value ?? 0) / 100 ?? 0
              )}
            </p>
          </Col>
          <Col
            size={3}
            small={2}
            style={{ display: "flex" }}
            className="u-align--right"
          >
            <Button
              appearance="positive"
              onClick={handleSubmit}
              style={{ marginBlock: "auto" }}
            >
              Buy Now
            </Button>
          </Col>
        </Row>
      </section>
    </>
  );
};
export default CredExamShop;
