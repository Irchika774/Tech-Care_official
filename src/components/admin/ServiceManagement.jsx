
import { useState, useEffect } from 'react';
import { servicesAPI } from '../../lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag, DollarSign, Wrench } from 'lucide-react';
import CurrencyDisplay from '../CurrencyDisplay';

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        duration: '30'
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await servicesAPI.getAll();
            // Ensure data is array (fallback if API returns wrapped object)
            setServices(Array.isArray(data) ? data : (data.services || []));
        } catch (error) {
            console.error('Failed to fetch services:', error);
            // Fallback for demo if API fails
            setServices([
                { id: '1', name: 'Screen Repair', price: 12000, category: 'Hardware', duration: '60', description: 'Complete screen replacement' },
                { id: '2', name: 'Battery Replacement', price: 5000, category: 'Hardware', duration: '30', description: 'New battery installation' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description,
                price: service.price,
                category: service.category,
                duration: service.duration
            });
        } else {
            setEditingService(null);
            setFormData({ name: '', description: '', price: '', category: '', duration: '30' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingService) {
                await servicesAPI.update(editingService.id || editingService._id, formData);
                toast({ title: "Service Updated", description: `${formData.name} has been updated.` });
            } else {
                await servicesAPI.create(formData);
                toast({ title: "Service Created", description: `${formData.name} has been created.` });
            }
            setIsModalOpen(false);
            fetchServices();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save service. " + (error.response?.data?.error || error.message),
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await servicesAPI.delete(id);
            toast({ title: "Service Deleted", description: "The service has been removed." });
            fetchServices();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete service.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-['Outfit'] font-bold text-white">Service Management</h2>
                    <p className="text-zinc-400 font-['Inter']">Manage available repair services and pricing</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-white text-black hover:bg-gray-100">
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableHead className="text-zinc-400">Service Name</TableHead>
                                <TableHead className="text-zinc-400">Category</TableHead>
                                <TableHead className="text-zinc-400">Price</TableHead>
                                <TableHead className="text-zinc-400">Duration</TableHead>
                                <TableHead className="text-right text-zinc-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">Loading services...</TableCell>
                                </TableRow>
                            ) : services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">No services found.</TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => (
                                    <TableRow key={service.id || service._id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="font-medium text-white">
                                            <div className="flex items-center gap-2">
                                                <Wrench className="h-4 w-4 text-blue-500" />
                                                <div>
                                                    <div>{service.name}</div>
                                                    <div className="text-xs text-zinc-500">{service.description}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                                                {service.category || 'General'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-emerald-400 font-mono">
                                            <CurrencyDisplay amount={service.price} />
                                        </TableCell>
                                        <TableCell className="text-zinc-300">{service.duration} mins</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(service)} className="text-zinc-400 hover:text-white">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id || service._id)} className="text-zinc-400 hover:text-red-400">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Configure the service details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Service Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-zinc-800 border-zinc-700 text-white"
                                placeholder="e.g. Screen Replacement"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Description</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-zinc-800 border-zinc-700 text-white"
                                placeholder="Brief description of the service"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-300">Price (LKR)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="bg-zinc-800 border-zinc-700 text-white pl-9"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-300">Duration (mins)</Label>
                                <Input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    placeholder="30"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Category</Label>
                            <Input
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="bg-zinc-800 border-zinc-700 text-white"
                                placeholder="Hardware, Software, etc."
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-zinc-700 text-white">
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-white text-black hover:bg-gray-100">
                                {editingService ? 'Update Service' : 'Create Service'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ServiceManagement;
