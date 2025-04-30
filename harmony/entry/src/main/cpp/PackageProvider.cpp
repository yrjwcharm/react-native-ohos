#include "RNOH/PackageProvider.h"

using namespace rnoh;
#include "generated/rtn_calculator/RNOH/generated/BaseRtnCalculatorPackage.h"

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
         std::make_shared<BaseRtnCalculatorPackage>(ctx)
    };
}