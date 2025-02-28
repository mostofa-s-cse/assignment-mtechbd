import React, { useEffect, useState } from 'react';
import { usePromotions } from '../../hooks/usePromotions';
import { authClient } from '../../constants/axiosInstance';

const PromotionList = () => {
    const { promotions, fetchPromotions, editPromotion, togglePromotion, createPromotion, deletePromotion } = usePromotions();
    const [isEditing, setIsEditing] = useState(false);
    const [currentPromotion, setCurrentPromotion] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        type: 'PERCENTAGE', 
        discountValue: '0', 
        isEnabled: true,
        products: [], 
        slabs: [], 
    });

    useEffect(() => {
        fetchPromotions(); 
    }, [fetchPromotions]);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await authClient.get('/products');
                if (response.status === 200) {
                    setProducts(response.data.data); 
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'discountValue' ? Math.max(0, parseFloat(value)) : value; 
        setFormData({ ...formData, [name]: newValue });
    };

    const handleProductChange = (e) => {
        const selectedProducts = Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10)); 
        setFormData({ ...formData, products: selectedProducts });
    };

    const handleSlabChange = (index, e) => {
        const { name, value } = e.target;
        const newSlabs = [...formData.slabs];
        newSlabs[index][name] = parseFloat(value); 
        setFormData({ ...formData, slabs: newSlabs });
    };

    const addSlab = () => {
        const newSlabs = [...formData.slabs];
        newSlabs.push({ minWeight: 0, maxWeight: 0, discountPerUnit: 0 });
        setFormData({ ...formData, slabs: newSlabs });
    };

    const removeSlab = (index) => {
        const newSlabs = formData.slabs.filter((_, i) => i !== index);
        setFormData({ ...formData, slabs: newSlabs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startDateString = formData.startDate;
        const endDateString = formData.endDate;

        if (!startDateString || !endDateString) {
            console.error("Start date and end date must be provided.");
            return; 
        }

        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error("Invalid date format.");
            return; 
        }

        const promotionData = {
            title: formData.title,
            type: formData.type,
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString(),     
            isEnabled: formData.isEnabled,
            products: formData.products,
            PromotionSlabs: formData.slabs.map(slab => ({
                minWeight: slab.minWeight,
                maxWeight: slab.maxWeight,
                discountPerUnit: slab.discountPerUnit,
            })),
        };

        if (isEditing) {
            await editPromotion(currentPromotion.id, promotionData);
            setIsEditing(false);
            setCurrentPromotion(null);
        } else {
            await createPromotion(promotionData);
        }

        setFormData({ title: '', startDate: '', endDate: '', type: 'PERCENTAGE', discountValue: '0', isEnabled: true, products: [], slabs: [] }); // Reset form
        fetchPromotions(); 
    };

    const handleEditClick = (promotion) => {
        setIsEditing(true);
        setCurrentPromotion(promotion);
        setFormData({
            title: promotion.title,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
            type: promotion.type,
            discountValue: promotion.discountValue,
            isEnabled: promotion.isEnabled,
            products: promotion.products,
            slabs: promotion.promotionSlabs || [], 
        });
    };

    const handleToggleClick = async (promotionId) => {
        await togglePromotion(promotionId);
        fetchPromotions(); 
    };

    const handleDeleteClick = async (promotionId) => {
        await deletePromotion(promotionId);
        fetchPromotions(); 
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4">Promotions</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <label htmlFor="">Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Promotion Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                    required
                />
                <label htmlFor="">Start Date</label>
                <input
                    type="datetime-local"
                    name="startDate"
                    placeholder="Start Date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                    required
                />
                <label htmlFor="">End Date</label>
                <input
                    type="datetime-local"
                    name="endDate"
                    placeholder="End Date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                    required
                />

                {isEditing ? null : (
                    <>
                        <label htmlFor="">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="border p-2 mr-2"
                            required
                        >
                            <option value="PERCENTAGE">PERCENTAGE</option>
                            <option value="FIXED">FIXED</option>
                            <option value="WEIGHTED">WEIGHTED</option>
                        </select>
                        <label htmlFor="">Discount Value (PERCENTAGE & FIXED)</label>
                        <input
                            type="number"
                            name="discountValue"
                            placeholder="Discount Value"
                            value={formData.discountValue}
                            onChange={handleInputChange}
                            className="border p-2 mr-2"
                            required={formData.type === 'PERCENTAGE' || formData.type === 'FIXED'}
                        />
                        <label htmlFor="">Product select</label>
                        <select
                            name="products"
                            multiple
                            value={formData.products}
                            onChange={handleProductChange}
                            className="border p-2 mr-2"
                            required
                        >
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        {formData.type === 'WEIGHTED' && (
                            <button type="button" onClick={addSlab} className="bg-green-500 text-white p-2 mr-2">
                                Add Slab
                            </button>
                        )}
                    </>
                )}
                <button type="submit" className="bg-blue-500 text-white p-2">
                    {isEditing ? 'Update Promotion ' : 'Add Promotion'}
                </button>
            </form>
            {formData.type === 'WEIGHTED' && ( 
                <>
                    {isEditing ? null : (<>
                        <table className="min-w-full border mb-4">
                            <thead>
                                <tr>
                                    <th className="border">Min Weight</th>
                                    <th className="border">Max Weight</th>
                                    <th className="border">Discount Per Unit</th>
                                    <th className="border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.slabs.map((slab, index) => (
                                    <tr key={index}>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                name="minWeight"
                                                value={slab.minWeight}
                                                onChange={(e) => handleSlabChange(index, e)}
                                                className="border p-1"
                                                required
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                name="maxWeight"
                                                value={slab.maxWeight}
                                                onChange={(e) => handleSlabChange(index, e)}
                                                className="border p-1"
                                                required
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                name="discountPerUnit"
                                                value={slab.discountPerUnit}
                                                onChange={(e) => handleSlabChange(index, e)}
                                                className="border p-1"
                                                required
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <button onClick={() => removeSlab(index)} className="text-red-500">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                    )}
                </>
            )}
            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="border">Title</th>
                        <th className="border">Start Date</th>
                        <th className="border">End Date</th>
                        <th className="border">Type</th>
                        <th className="border">Discount Value</th>
                        <th className="border">Enabled</th>
                        <th className="border">Products</th>
                        <th className="border">Slabs</th>
                        <th className="border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map((promotion) => {
                        const startDate = new Date(promotion.startDate);
                        const endDate = new Date(promotion.endDate);

                        const isStartDateValid = !isNaN(startDate.getTime());
                        const isEndDateValid = !isNaN(endDate.getTime());

                        return (
                            <tr key={promotion.id}>
                                <td className="border p-2">{promotion.title}</td>
                                <td className="border p-2">
                                    {isStartDateValid ? startDate.toISOString() : 'Invalid Start Date'}
                                </td>
                                <td className="border p-2">
                                    {isEndDateValid ? endDate.toISOString() : 'Invalid End Date'}
                                </td>
                                <td className="border p-2">{promotion.type}</td>
                                <td className="border p-2">{promotion.discountValue}</td>
                                <td className="border p-2">{promotion.isEnabled ? 'Yes' : 'No'}</td>
                                <td className="border p-2">
                                    {Array.isArray(promotion.products) && promotion.products.length > 0 ? (
                                        promotion.products.map(product => product.name).join(', ')
                                    ) : (
                                        <span>No products associated</span>
                                    )}
                                </td>
                                <td className="border p-2">
                                    {Array.isArray(promotion.promotionSlabs) && promotion.promotionSlabs.length > 0 ? (
                                        promotion.promotionSlabs.map((slab, index) => (
                                            <div key={index}>
                                                Min: {slab.minWeight}, Max: {slab.maxWeight}, Discount: {slab.discountPerUnit}
                                            </div>
                                        ))
                                    ) : (
                                        <span>No slabs available</span>
                                    )}
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleEditClick(promotion)}
                                        className="text-blue-500 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleClick(promotion.id)}
                                        className={`text-${promotion.isEnabled ? 'red' : 'green'}-500`}
                                    >
                                        {promotion.isEnabled ? 'Disable' : 'Enable'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(promotion.id)}
                                        className="text-red-500 ml-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PromotionList;