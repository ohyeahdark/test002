
import PageMeta from "../../components/common/PageMeta";
import EmployeeManagement from "../employees/EmployeePage";

export default function Employee() {
  return (
    <>
      <PageMeta
        title="Human Resource Managerment"
        description="Human Resource Managerment - ItAiUa"
      />
      
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EmployeeManagement />
        </div>
      </div>
    </>
  );
}
