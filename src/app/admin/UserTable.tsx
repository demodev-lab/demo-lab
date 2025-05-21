import React from "react";

export default function UserTable() {
  // TODO: 실제 데이터 연동 필요
  // 더미 회원 데이터
  const users = [
    {
      email: "user@email.com",
      joined: "2024-06-01",
      name: "홍길동",
      phone: "010-1234-5678",
      role: "user",
    },
    {
      email: "admin@email.com",
      joined: "2024-05-20",
      name: "김관리",
      phone: "010-9876-5432",
      role: "admin",
    },
  ];

  const [editUsers, setEditUsers] = React.useState(users);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const [modalForm, setModalForm] = React.useState({
    name: "",
    phone: "",
    role: "user",
    email: "",
  });

  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState({
    email: "",
    name: "",
    phone: "",
    role: "user",
  });

  const openModal = (idx: number) => {
    setSelectedIdx(idx);
    setModalForm({
      name: editUsers[idx].name,
      phone: editUsers[idx].phone,
      role: editUsers[idx].role,
      email: editUsers[idx].email,
    });
    setModalOpen(true);
  };

  const handleModalChange = (key: string, value: string) => {
    setModalForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleModalSave = () => {
    if (selectedIdx === null) return;
    setEditUsers((prev) =>
      prev.map((u, i) => (i === selectedIdx ? { ...u, ...modalForm } : u)),
    );
    setModalOpen(false);
    alert(
      `회원 정보가 저장되었습니다.\n이메일: ${modalForm.email}\n이름: ${modalForm.name}\n전화번호: ${modalForm.phone}`,
    );
  };

  const handleAddChange = (key: string, value: string) => {
    setAddForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddUser = () => {
    setEditUsers((prev) => [
      ...prev,
      { ...addForm, joined: new Date().toISOString().slice(0, 10) },
    ]);
    setAddModalOpen(false);
    setAddForm({ email: "", name: "", phone: "", role: "user" });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">회원 목록</h3>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setAddModalOpen(true)}
        >
          + 회원 직접 추가
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-center">번호</th>
            <th className="text-center">이메일</th>
            <th className="text-center">가입일</th>
            <th className="text-center">이름</th>
            <th className="text-center">전화번호</th>
            <th className="text-center">권한</th>
            <th className="text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {editUsers.map((user, idx) => (
            <tr key={user.email}>
              <td className="py-2 text-center">{idx + 1}</td>
              <td className="text-center">{user.email}</td>
              <td className="text-center">{user.joined}</td>
              <td className="text-center">{user.name}</td>
              <td className="text-center">{user.phone}</td>
              <td className="text-center">{user.role}</td>
              <td className="text-center">
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => openModal(idx)}
                >
                  수정
                </button>
                <button className="text-red-500">삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 회원정보 수정 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-4">회원 정보 수정</h4>
            <div className="mb-3">
              <label className="block text-sm mb-1">이메일</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={modalForm.email}
                onChange={(e) => handleModalChange("email", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">이름</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={modalForm.name}
                onChange={(e) => handleModalChange("name", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">전화번호</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={modalForm.phone}
                onChange={(e) => handleModalChange("phone", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">권한</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={modalForm.role}
                onChange={(e) => handleModalChange("role", e.target.value)}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded w-full"
              onClick={handleModalSave}
            >
              저장
            </button>
          </div>
        </div>
      )}
      {/* 회원 직접 추가 모달 */}
      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setAddModalOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-lg font-bold mb-4">회원 직접 추가</h4>
            <div className="mb-3">
              <label className="block text-sm mb-1">이메일</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addForm.email}
                onChange={(e) => handleAddChange("email", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">이름</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addForm.name}
                onChange={(e) => handleAddChange("name", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">전화번호</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={addForm.phone}
                onChange={(e) => handleAddChange("phone", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">권한</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={addForm.role}
                onChange={(e) => handleAddChange("role", e.target.value)}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded w-full"
              onClick={handleAddUser}
            >
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
