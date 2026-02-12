import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Shield,
    Users,
    Plus,
    Search,
    Edit2,
    Trash2,
    Save,
    X
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
    id: string;
    name: string;
    email: string;
    partnerId: string;
    role: 'Admin' | 'Marketing' | 'IT' | 'Viewer';
    alertLevel: ('Critical' | 'High' | 'Medium' | 'Low')[];
    status: 'Active' | 'Inactive';
}

const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        partnerId: 'P001',
        role: 'Admin',
        alertLevel: ['Critical', 'High', 'Medium'],
        status: 'Active'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        partnerId: 'P002',
        role: 'Marketing',
        alertLevel: ['Critical'],
        status: 'Active'
    },
    {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        partnerId: 'P003',
        role: 'IT',
        alertLevel: ['Critical', 'High', 'Medium'],
        status: 'Active'
    },
    {
        id: '4',
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        partnerId: 'P004',
        role: 'Marketing',
        alertLevel: ['Critical'],
        status: 'Inactive'
    }
];

export function SecurityRolesTab() {
    // State
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Filter State
    const [roleFilters, setRoleFilters] = useState<User['role'][]>([]);
    const [alertFilters, setAlertFilters] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        partnerId: '',
        role: 'Viewer',
        alertLevel: [],
        status: 'Active'
    });

    // Handlers
    const handleOpenDialog = (mode: 'add' | 'edit', user?: User) => {
        setDialogMode(mode);
        setSelectedUser(user || null);
        if (user) {
            setFormData({ ...user });
        } else {
            setFormData({
                name: '',
                email: '',
                partnerId: '',
                role: 'Viewer',
                alertLevel: [],
                status: 'Active'
            });
        }
        setIsDialogOpen(true);
    };

    const handleSaveUser = () => {
        if (!formData.name || !formData.email) return; // Basic validation

        if (dialogMode === 'add') {
            const newUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.name!,
                email: formData.email!,
                partnerId: formData.partnerId || '',
                role: formData.role as User['role'],
                alertLevel: formData.alertLevel as User['alertLevel'],
                status: formData.status as User['status']
            };
            setUsers([...users, newUser]);
        } else if (dialogMode === 'edit' && selectedUser) {
            const updatedUsers = users.map(u =>
                u.id === selectedUser.id ? { ...u, ...formData } as User : u
            );
            setUsers(updatedUsers);
        }
        setIsDialogOpen(false);
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    const toggleAlertLevel = (level: 'Critical' | 'High' | 'Medium' | 'Low') => {
        const currentLevels = formData.alertLevel || [];
        if (currentLevels.includes(level)) {
            setFormData({ ...formData, alertLevel: currentLevels.filter(l => l !== level) });
        } else {
            setFormData({ ...formData, alertLevel: [...currentLevels, level] });
        }
    };

    const toggleRoleFilter = (role: User['role']) => {
        setRoleFilters(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const toggleAlertFilter = (level: string) => {
        setAlertFilters(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'Admin': return 'destructive';
            case 'IT': return 'default'; // Orange/Primary
            case 'Marketing': return 'secondary'; // Yellow/Secondary
            default: return 'outline';
        }
    };

    const getAlertLevelColors = (level: string) => {
        switch (level) {
            case 'Critical': return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Low': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilters.length === 0 || roleFilters.includes(user.role);

        const matchesAlert = alertFilters.length === 0 ||
            (user.alertLevel.some(level => alertFilters.includes(level)));

        return matchesSearch && matchesRole && matchesAlert;
    });

    return (
        <div className="flex-1 flex flex-col bg-background/50">
            {/* Header */}
            <div className="border-b border-border bg-card px-8 py-6">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Users</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <h2 className="text-lg font-semibold text-foreground/80">User Management</h2>
                            <span className="text-muted-foreground">- Manage users and their roles</span>
                        </div>
                    </div>
                    <Button onClick={() => handleOpenDialog('add')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto w-full space-y-6">

                    <Card className="p-6">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className={roleFilters.length > 0 ? "bg-primary/10 border-primary/20 text-primary" : ""}>
                                            <Users className="w-4 h-4 mr-2" />
                                            Filter Roles
                                            {roleFilters.length > 0 && (
                                                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                                    {roleFilters.length}
                                                </Badge>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>Select Roles</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {['Admin', 'Marketing', 'IT', 'Viewer'].map((role) => (
                                            <DropdownMenuItem
                                                key={role}
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    toggleRoleFilter(role as User['role']);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={roleFilters.includes(role as User['role'])}
                                                        onCheckedChange={() => toggleRoleFilter(role as User['role'])}
                                                    />
                                                    <span>{role}</span>
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                        {roleFilters.length > 0 && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="justify-center text-center text-sm font-medium text-primary cursor-pointer"
                                                    onSelect={() => setRoleFilters([])}
                                                >
                                                    Clear Filters
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className={alertFilters.length > 0 ? "bg-primary/10 border-primary/20 text-primary" : ""}>
                                            <Shield className="w-4 h-4 mr-2" />
                                            Permissions
                                            {alertFilters.length > 0 && (
                                                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                                    {alertFilters.length}
                                                </Badge>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>Filter by Alert Level</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {['Critical', 'High', 'Medium', 'Low'].map((level) => (
                                            <DropdownMenuItem
                                                key={level}
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    toggleAlertFilter(level);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={alertFilters.includes(level)}
                                                        onCheckedChange={() => toggleAlertFilter(level)}
                                                    />
                                                    <span>{level}</span>
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                        {alertFilters.length > 0 && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="justify-center text-center text-sm font-medium text-primary cursor-pointer"
                                                    onSelect={() => setAlertFilters([])}
                                                >
                                                    Clear Filters
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Table */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[20%]">Name</TableHead>
                                    <TableHead className="w-[25%]">Email</TableHead>
                                    <TableHead className="w-[10%]">Partner ID</TableHead>
                                    <TableHead className="w-[15%]">Role</TableHead>
                                    <TableHead className="w-[20%]">Alert Level</TableHead>
                                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="group hover:bg-muted/50">
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell>{user.partnerId}</TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {user.alertLevel.map((level) => (
                                                        <span
                                                            key={level}
                                                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getAlertLevelColors(level)}`}
                                                        >
                                                            {level}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog('edit', user)}>
                                                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                </div>
            </div>

            {/* Add/Edit User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === 'add' ? 'Add New User' : 'Edit User'}</DialogTitle>
                        <DialogDescription>
                            {dialogMode === 'add' ? 'Create a new user and assign roles.' : 'Update user details and permissions.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Partner ID</Label>
                                <Input
                                    placeholder="e.g. P123"
                                    value={formData.partnerId}
                                    onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                placeholder="name@company.com"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(val) => setFormData({ ...formData, role: val as User['role'] })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="Viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="mb-2 block">Alert Levels</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Critical', 'High', 'Medium', 'Low'].map((level) => (
                                    <div key={level} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`level-${level}`}
                                            checked={formData.alertLevel?.includes(level as any)}
                                            onCheckedChange={() => toggleAlertLevel(level as any)}
                                        />
                                        <label
                                            htmlFor={`level-${level}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {level}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveUser}>
                            {dialogMode === 'add' ? 'Create User' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
