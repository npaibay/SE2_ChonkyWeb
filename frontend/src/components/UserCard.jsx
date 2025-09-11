import Card from "./Card";
import Button from "./Button";

function UserCard({ user, onEdit, onDelete, showActions = true }) {
  return (
    <Card 
      title={user.username}
      subtitle={user.email}
      className="hover:shadow-lg transition-shadow"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Role:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.is_admin 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-gray-200'
          }`}>
            {user.is_admin ? 'Admin' : 'User'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.is_active 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {showActions && (
          <div className="flex space-x-2 pt-2">
            {onEdit && (
              <Button
                onClick={() => onEdit(user)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(user)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default UserCard;
