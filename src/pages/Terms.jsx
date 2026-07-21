import StaticPageLayout from '../components/layout/StaticPageLayout.jsx'

function Terms() {
    return (
        <StaticPageLayout title="Terms & Conditions">
            <p>By accessing and using this website, you agree to be bound by the following terms and conditions.</p>
            <h3 className="font-semibold text-gray-800 pt-2">Use of Site</h3>
            <p>This website and its content are intended for personal, non-commercial use. You may not reproduce, distribute, or modify any content without prior written permission.</p>
            <h3 className="font-semibold text-gray-800 pt-2">Product Information</h3>
            <p>We strive to ensure all product descriptions and pricing are accurate. However, errors may occur, and we reserve the right to correct them at any time.</p>
            <h3 className="font-semibold text-gray-800 pt-2">Orders</h3>
            <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion.</p>
        </StaticPageLayout>
    )
}

export default Terms