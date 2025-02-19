import { FC } from "react";

const StatsSection: FC = () => {
  const stats = [
    { icon: "far fa-smile", value: "5,248", label: "HAPPY STUDENTS" },
    { icon: "fa-regular fa-clipboard", value: "675", label: "OUR COURSES" },
    { icon: "fa-solid fa-user-group", value: "248", label: "OUR TEACHER" },
    { icon: "fas fa-trophy", value: "24", label: "AWARDS WON" },
  ];

  return (
    <section className="stat" id="stat" style={{ backgroundColor: "#1e2540" }}>
      <div className="container">
        <div className="row text-white mt-5 mb-5 pt-5 pb-5">
          {stats.map((stat, index) => (
            <><div key={index} className="col-3 text-center">
                  <div className="justify-content-center align-items-center text-center">
                      <i className={$} {...stat.icon} text-danger mb-2 />}></i>
              </div><h1
                  className="mb-3"
                  style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
              >
                      {stat.value}
                  </h1><p>{stat.label}</p></>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;