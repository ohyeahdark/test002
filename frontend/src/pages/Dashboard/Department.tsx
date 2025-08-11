
import PageMeta from "../../components/common/PageMeta";
import DepartmentPage from "../../features/departments/DepartmentPage";

export default function Department() {
  return (
    <>
      <PageMeta
        title="Human Resource Managerment"
        description="Human Resource Managerment - ItAiUa"
      />

      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1">
          <DepartmentPage />
        </div>
      </div>
    </>
  );
}
