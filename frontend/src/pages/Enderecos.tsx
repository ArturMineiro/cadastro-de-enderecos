import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import FormEndereco from "../components/FormEndereco";
import ListaEnderecos from "../components/ListaEndereco";
import { MapPin, List } from "lucide-react";

const Enderecos: React.FC = () => {


  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-4 md:p-8 flex flex-col items-center gap-10">
      {/* Formulário */}
      <Card className="w-full max-w-full md:max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex items-center gap-3 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <MapPin className="text-indigo-600 dark:text-indigo-400 w-5 h-5 md:w-6 md:h-6" />
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gerenciar Endereços
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6">
          <FormEndereco />
        </CardContent>
      </Card>

      <Card className="w-full max-w-full md:max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
        <CardHeader className="flex items-center gap-3 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <List className="text-indigo-600 dark:text-indigo-400 w-5 h-5 md:w-6 md:h-6" />
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Endereços Salvos
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto max-h-[60vh] p-4 md:p-6">
          <ListaEnderecos />
        </CardContent>
      </Card>
    </div>
  );
};

export default Enderecos;