import { useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { ToastContext } from "../context/ToastContext";
const FuelLogForm = ({ busId, onDone }) => {
  const { showToast } = useContext(ToastContext);
  const [liters, setLiters] = useState("");
  const [previousLog, setPreviousLog] = useState(null);
  const [sameRoute, setSameRoute] = useState(null);
  const [km, setKm] = useState("");
  useEffect(() => {
    axiosInstance
      .get(`/buses/${busId}/fuel-log`)
      .then((res) => setPreviousLog(res.data[0] || null))
      .catch(() => {});
  }, [busId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const litersNum = Number(liters);
    if (!litersNum) {
      showToast("Enter liters filled", "error");
      return;
    }
    let kmValue;
    if (previousLog && sameRoute === true) {
      kmValue = previousLog.kmCovered;
    } else {
      kmValue = Number(km);
      if (!kmValue) {
        showToast("Enter kilometers covered", "error");
        return;
      }
    }
    try {
      const res = await axiosInstance.post(`/buses/${busId}/fuel-log`, {
        litersFilled: litersNum,
        kmCovered: kmValue,
      });
      const mileage = res.data.log.mileage;
      const days = res.data.daysSinceLastFill;
      showToast(
        `Logged ${litersNum}L over ${kmValue}km → ${mileage} km/l${days !== null ? ` · ${days} day(s) since last fill` : ""}`,
      );
      onDone();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to log fuel", "error");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: "1px solid var(--color-line)",
      }}
    >
      {" "}
      <div className="field" style={{ marginBottom: 8 }}>
        {" "}
        <label>Liters Filled</label>{" "}
        <input
          type="number"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
          required
        />{" "}
      </div>{" "}
      {previousLog && (
        <div className="field" style={{ marginBottom: 8 }}>
          {" "}
          <label>
            Same route as last fill? ({previousLog.kmCovered} km)
          </label>{" "}
          <div style={{ display: "flex", gap: 8 }}>
            {" "}
            <button
              type="button"
              className={`btn ${sameRoute === true ? "btn--primary" : "btn--ghost"}`}
              style={{ fontSize: 12, padding: "6px 12px" }}
              onClick={() => setSameRoute(true)}
            >
              Yes, same route
            </button>{" "}
            <button
              type="button"
              className={`btn ${sameRoute === false ? "btn--primary" : "btn--ghost"}`}
              style={{ fontSize: 12, padding: "6px 12px" }}
              onClick={() => setSameRoute(false)}
            >
              No, different
            </button>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {(!previousLog || sameRoute === false) && (
        <div className="field" style={{ marginBottom: 8 }}>
          {" "}
          <label>Kilometers Covered</label>{" "}
          <input
            type="number"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            required
          />{" "}
        </div>
      )}{" "}
      <button
        type="submit"
        className="btn btn--primary"
        style={{ fontSize: 12, padding: "6px 12px" }}
      >
        Save Fuel Log
      </button>{" "}
    </form>
  );
};
export default FuelLogForm;
