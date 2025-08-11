
import PageMeta from "../../components/common/PageMeta";
import EmployeePage from "../../features/employees/EmployeePage";

export default function Employee() {
  return (
    <>
      <PageMeta
        title="Human Resource Managerment"
        description="Human Resource Managerment - ItAiUa"
      />

      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1">
          <EmployeePage />
        </div>
      </div>
    </>
  );
}
