export function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">المشاريع</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold mb-2">مشروع {i}</h3>
            <p className="text-gray-600">وصف المشروع...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
