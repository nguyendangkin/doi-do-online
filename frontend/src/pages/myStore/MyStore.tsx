import { Card, CardContent, CardHeader } from "@/components/ui/card";
import oneImage from "@/assets/images/products/1.jpg";

import DiaLogUploadContentModal from "@/pages/myStore/DiaLogUploadContentModal";
export default function MyStore() {
    return (
        <div>
            <div className="grid grid-cols-4 gap-4">
                <DiaLogUploadContentModal />
                <Card className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer">
                    <CardHeader>
                        <img
                            className="w-full h-[200px] object-cover aspect-w-16 aspect-h-9 rounded"
                            src={oneImage}
                            alt="ảnh 1"
                        />
                    </CardHeader>
                    <CardContent>
                        <p>
                            xin chào các bạn đã đến với channel của mình mình là
                            cô gái súng đạn lòng nhiệt huyết này không thể cạn
                            và sự điên rồ là vô giới hạn mình là phần tử chống
                            đối quậy khắp nơi ở pitover xin chào các bạn nhé nè
                            nha oke
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer">
                    <CardHeader>
                        <img
                            className="w-full h-[200px] object-cover aspect-w-16 aspect-h-9 rounded"
                            src={oneImage}
                            alt="ảnh 1"
                        />
                    </CardHeader>
                    <CardContent>
                        <p>
                            xin chào các bạn đã đến với channel của mình mình là
                            cô gái súng đạn lòng nhiệt huyết này không thể cạn
                            và sự điên rồ là vô giới hạn mình là phần tử chống
                            đối quậy khắp nơi ở pitover xin chào các bạn nhé nè
                            nha oke
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer">
                    <CardHeader>
                        <img
                            className="w-full h-[200px] object-cover aspect-w-16 aspect-h-9 rounded"
                            src={oneImage}
                            alt="ảnh 1"
                        />
                    </CardHeader>
                    <CardContent>
                        <p>
                            xin chào các bạn đã đến với channel của mình mình là
                            cô gái súng đạn lòng nhiệt huyết này không thể cạn
                            và sự điên rồ là vô giới hạn mình là phần tử chống
                            đối quậy khắp nơi ở pitover xin chào các bạn nhé nè
                            nha oke
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
